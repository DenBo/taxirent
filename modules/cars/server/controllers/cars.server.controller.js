'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Car = mongoose.model('Car'),
  ActiveRent = mongoose.model('ActiveRent'),
  globalVarsCtrl = require(path.resolve('./modules/globalvars/server/controllers/globalvars.server.controller')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

let carNames = [
  'Opel Astra',
  'Opel Meriva',
  'Opel Insignia',
  'Opel Corsa',
  'Opel Kadett',
  'BMW X5',
  'BMW M3',
  'BMW X1',
  'Citroen C5',
  'Citroen C4',
  'Citroen Xsara',
  'Citroen Xsara Picasso',
  'Citroen Cactus',
  'Renault Clio',
  'Renault Megane',
  'Renault Megane Scenic',
  'Renault VelSatis',
  'Dacia Logan',
  'Porsche Panamera',
  'Porsche Cayenne',
  'Hyundai Getz',
  'Kia Sportage',
  'Nissan Micra',
  'Fiat Punto',
  'Fiat Doblo',
  'Audi A3',
  'Audi A5',
  'Audi A6',
  'Peugeot 306',
  'Peugeot 206',
  'Ford Focus',
  'Ford C-Max',
  'Ford S-Max',
  'Mercedes A Class'
];

let carImages = [
  'blue.png',
  'green.png',
  'grey.png',
  'pink.png',
  'red.png',
  'yellow.png'
];

/**
 * Create a car
 */
exports.create = function (req, res) {

  globalVarsCtrl.getProfit_S().then(
    function (globalVar) {
      let profit = globalVar.profit;

      if (profit < 100) {
        return res.status(422).send({
          message: 'Insufficient funds to buy a car'
        });
      }
      // TODO: After checking funds profit should be locked until
      // this transaction finishes
      var car = new Car(req.body);

      if (req.body.random && req.body.random === true) {
        car.name = carNames[Math.floor(Math.random() * carNames.length)];
        car.image = carImages[Math.floor(Math.random() * carImages.length)];
        car.dateManufactured = randomDate(new Date(2000, 0, 1), new Date());
        car.maxPassengers = Math.floor((Math.random() * 6) + 4);
        car.maxSpeed = Math.floor((Math.random() * 280) + 140);
        car.tariffGroup = '5ac4e29aaa293c1af8dc94de';
      }

      car.save(function (err) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          // TODO: car price can be stored in database
          globalVarsCtrl.addToProfit_S(-10000).then(
            function () {
              res.json(car);
            },
            function (err) {
              return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
              });
            }
          );
        }
      });
    },
    function (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
  );
};

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Show the current car
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var car = req.car ? req.car.toJSON() : {};

  res.json(car);
};

/**
 * Update a car
 */
exports.update = function (req, res) {
  var car = req.car;

  car.name = req.body.name;
  car.image = req.body.image;
  car.dateManufactured = req.body.dateManufactured;
  car.maxPassengers = req.body.maxPassengers;
  car.maxSpeed = req.body.maxSpeed;
  car.tariffGroup = req.body.tariffGroup;

  // If car is being retired check if it is rented at the moment
  if (car.status !== 'retired' && req.body.status === 'retired') {
    car.status = req.body.status;
    ActiveRent.find().populate('rent').exec().then(succActiveRentsCbk, errActiveRentsCbk);
  } else {
    car.status = req.body.status;
    car.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(car);
      }
    });
  }

  function succActiveRentsCbk(activeRents) {
    for (let i = 0; i < activeRents.length; i++) {
      if (activeRents[i].rent.car.equals(car._id)) {
        return res.status(422).send({
          message: 'Cannot retire a rented car'
        });
      }
    }

    car.save(function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(car);
      }
    });
  }

  function errActiveRentsCbk(err) {
    return res.status(422).send({
      message: errorHandler.getErrorMessage(err)
    });
  }
};

/**
 * Delete a car
 */
exports.delete = function (req, res) {
  var car = req.car;

  car.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(car);
    }
  });
};

/**
 * List of cars
 */
exports.list = function (req, res) {
  Car.find().sort('-name').populate('tariffGroup', 'class').exec(function (err, cars) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cars);
    }
  });
};

/**
 * Car middleware
 */
exports.carByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Car is invalid'
    });
  }

  Car.findById(id).populate({
    path: 'tariffGroup',
    populate: {
      path: 'tariffs',
      model: 'Tariff'
    } })
    .exec(function (err, car) {
      if (err) {
        return next(err);
      } else if (!car) {
        return res.status(404).send({
          message: 'No car with that identifier has been found'
        });
      }
      req.car = car;
      next();
    });
};

/**
 * Get car by id on server
 */
exports.carByID_S = function (carId) {
  let query = Car.findById(carId).select('tariffGroup status').populate({
    path: 'tariffGroup',
    populate: {
      path: 'tariffs',
      model: 'Tariff'
    }
  });

  return query.exec();
};
