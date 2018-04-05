'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Car = mongoose.model('Car'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a car
 */
exports.create = function (req, res) {

  var car = new Car(req.body);

  car.save(function (err) {
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

  car.save(function (err) {
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
  Car.find().sort('-name').exec(function (err, cars) {
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

  Car.findById(id).exec(function (err, car) {
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
