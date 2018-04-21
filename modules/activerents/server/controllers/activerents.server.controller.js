'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  ActiveRent = mongoose.model('ActiveRent'),
  carsCtrl = require(path.resolve('./modules/cars/server/controllers/cars.server.controller')),
  rentsCtrl = require(path.resolve('./modules/rents/server/controllers/rents.server.controller')),
  globalVarsCtrl = require(path.resolve('./modules/globalvars/server/controllers/globalvars.server.controller')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  cron = require('node-cron');

/**
 * Create an active rent
 */
exports.create = function (req, res) {
  var activeRent = new ActiveRent(req.body.activeRent);

  activeRent.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(activeRent);
    }
  });
};

/**
 * Show the current active rent
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var activeRent = req.activeRent ? req.activeRent.toJSON() : {};
  res.json(activeRent);
};

/**
 * Update an active rent
 */
exports.update = function (req, res) {
  var activeRent = req.activeRent;
  activeRent.rent = req.body.rent;

  activeRent.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(activeRent);
    }
  });
};

/**
 * Delete an active rent
 */
exports.delete = function (req, res) {
  var activeRent = req.activeRent;

  activeRent.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(activeRent);
    }
  });
};

/**
 * Cancel a rent
 */
exports.cancel = function (req, res) {
  var activeRent = req.body;
  rentsCtrl.rentByID_S(activeRent.rent._id)
  .then(
    function (rent) {
      console.log(rent);
      if (!rent) {
        return res.status(422).send({
          message: 'No rent was found associated with provided data'
        });
      }
      console.log(rent.customer);
      console.log(req.user);
      if (rent.customer !== req.user) {
        return res.status(403).send({
          message: 'Not allowed to cancel other users rent'
        });
      }
      activeRent.rent = rent;
      rent.dateEnded = new Date();
      rent.profit = 500;  // TODO: read from db (global vars)
      finishRent(activeRent).then(
        function () {
          res.json();
        },
        function (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
      );
    },
    function (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
  );
};

/**
 * Delete an active rent on server
 */
function delete_S(activeRent) {
  return new Promise((resolve, reject) => {
    activeRent.remove(function (err) {
      if (err) {
        return reject(err);
      } else {
        return resolve();
      }
    });
  });
}

/**
 * List of Active rents
 */
exports.list = function (req, res) {
  ActiveRent
  .find()
  .populate({
    path: 'rent',
    select: ['car', 'customer'],
    populate: {
      model: 'User',
      path: 'customer',
      select: 'username'
    }
  })
  .exec(function (err, activeRents) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(activeRents);
    }
  });
};

/**
 * Active rents middleware
 */
exports.activeRentByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Active rent is invalid'
    });
  }

  ActiveRent.findById(id).exec(function (err, activeRent) {
    if (err) {
      return next(err);
    } else if (!activeRent) {
      return res.status(404).send({
        message: 'No active rent with that identifier has been found'
      });
    }
    req.activeRent = activeRent;
    next();
  });
};

/**
 * List of Active rents on server
 */
function getActiveRents() {
  let query = ActiveRent.find().populate({
    path: 'rent',
    model: 'Rent'
  });

  return query.exec();
}

/**
 * Scheduled tasks: check if rent has finished
 */
cron.schedule('*/5 * * * * *', function () {
  getActiveRents().then(checkActiveRents, toConsole);
});

/**
 * Check if any rent has finished
 */
function checkActiveRents(activeRentsList) {
  let currentDate = new Date();
  for (let i = 0; i < activeRentsList.length; i++) {
    let activeRent = activeRentsList[i];
    let rent = activeRent.rent;
    let dateEnded = getDateEnded(rent);
    // If rent has ended set date ended, remove it from active rents and
    // add rent profit to global profit
    if (currentDate >= dateEnded) {
      rent.dateEnded = dateEnded;
      finishRent(activeRent);
    }
  }
}

function getDateEnded(rent) {
  // Calculate date when rent will end from starting date and duration
  let dateEnded = new Date(rent.dateStarted);
  dateEnded.setSeconds(dateEnded.getSeconds() + rent.duration);
  return dateEnded;
}

/**
 * Finish a rent
 */
function finishRent(activeRent) {
  return new Promise((resolve, reject) => {
    let rent = activeRent.rent;
    // Get car
    carsCtrl.carByID_S(rent.car).then(
      // Process rent
      function (car) {
        if (!car) {
          return reject('Rent contains invalid car id');
        }
        if (!rent.profit) {
          rent.profit = 0;
        }
        rent.profit += getPrice(rent.duration, car.tariffGroup);
        // Update rent with profit and date ended
        rentsCtrl.update_S(rent).then(
          function (rent) {
            // Delete rent from list of active rents
            delete_S(activeRent).then(
              function () {
                // Add profit from deleted active rent to total profit
                globalVarsCtrl.addToProfit_S(rent.profit)
                .then(
                  function () {
                    return resolve();
                  },
                  function (err) {
                    return reject(err);
                  }
                );
              },
              function (err) {
                return reject(err);
              }
            );
          },
          function (err) {
            return reject(err);
          }
        );
      },
      function (err) {
        return reject(err);
      }
    );
  });
}

/**
 * Get rent price
 */
function getPrice(dur, tariffGroup) {
  // Only works if tariffs are sorted by time active
  tariffGroup.tariffs.sort(compareTariffsByTimeActive);
  let price = 0;
  for (let i = 0; i < tariffGroup.tariffs.length; i++) {
    let pricePerSec = tariffGroup.tariffs[i].price;
    // If this is last specified tariff apply its price to all remaining duration
    if (i === tariffGroup.tariffs.length - 1) {
      price += dur * pricePerSec;
      return price;
    }
    let tariffDur = tariffGroup.tariffs[i + 1].activeAfter - tariffGroup.tariffs[i].activeAfter;
    // If duration does not reach next tariff also apply all remaining duration
    if (dur <= tariffDur) {
      price += dur * pricePerSec;
      return price;
    }
    price += tariffDur * pricePerSec;
    dur -= tariffDur;
  }
  return price;
}

/**
 * Write to console
 */
function toConsole(data) {
  console.log(data);
}

/**
 * Tariff sort by activeAfter comparator
 */
function compareTariffsByTimeActive(a, b) {
  if (a.activeAfter < b.activeAfter)
    return -1;
  if (a.activeAfter > b.activeAfter)
    return 1;
  return 0;
}
