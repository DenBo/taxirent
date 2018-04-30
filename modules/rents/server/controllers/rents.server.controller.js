'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Rent = mongoose.model('Rent'),
  ActiveRent = mongoose.model('ActiveRent'),
  carsCtrl = require(path.resolve('./modules/cars/server/controllers/cars.server.controller')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a rent
 */
exports.create = function (req, res) {
  var rent = new Rent(req.body);
  rent.customer = req.user;
  ActiveRent.find().populate({ path: 'rent', select: ['car', 'customer'] }).exec(function (err, activeRentsList) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      // Check if car is already rented first
      for (let i = 0; i < activeRentsList.length; i++) {
        if (activeRentsList[i].rent.car.equals(rent.car)) {
          return res.status(422).send({
            message: 'Car cannot be rented again until previous rent has completed'
          });
        }
        if (activeRentsList[i].rent.customer.equals(rent.customer._id)) {
          return res.status(422).send({
            message: 'Only one car can be rented per customer at a time'
          });
        }
      }

      carsCtrl.carByID_S(rent.car).then(
        function (car) {
          if (!car) {
            return res.status(422).send({
              message: 'Car associated with received rent could not be found'
            });
          }

          // Check if car is retired
          if (car.status === 'retired') {
            return res.status(422).send({
              message: 'Retired car cannot be rented'
            });
          }

          rent.save(function (err) {
            if (err) {
              return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
              });
            } else {
              var activeRent = new ActiveRent();
              activeRent.rent = rent;
              activeRent.save(function (err) {
                if (err) {
                  return res.status(422).send({
                    message: errorHandler.getErrorMessage(err)
                  });
                } else {
                  res.json(rent);
                }
              });
            }
          });
        },
        function (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
      );
    }
  });
};

/**
 * Show the current rent
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var rent = req.rent ? req.rent.toJSON() : {};

  // Add a custom field to the Rent, for determining if the current User is the "owner".
  // Owner can cancel a Rent
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Rent model.
  rent.isCurrentUserOwner = !!(req.user && rent.customer && rent.customer._id.toString() === req.user._id.toString());

  res.json(rent);
};

/**
 * Update a rent
 */
exports.update = function (req, res) {
  var rent = req.rent;

  rent.dateEnded = req.body.dateEnded;
  rent.duration = req.body.duration;
  rent.profit = req.body.profit;

  rent.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(rent);
    }
  });
};

/**
 * Update rent on server
 */
exports.update_S = function (rent) {
  return new Promise((resolve, reject) => {
    rent.save(function (err) {
      if (err) {
        return reject(err);
      } else {
        return resolve(rent);
      }
    });
  });
};

/**
 * Delete a rent
 */
exports.delete = function (req, res) {
  var rent = req.rent;

  rent.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(rent);
    }
  });
};

/**
 * List of Rents
 */
exports.list = function (req, res) {
  Rent
    .find()
    .sort('-dateStarted')
    .populate('car', 'name')
    .populate('customer', 'displayName')
    .exec(function (err, rents) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(rents);
      }
    });
};

/**
 * List of Rents filtered by Car
 */
exports.byCar = function (req, res) {
  var carId = req.body.carId;

  Rent
    .find({
      'car': carId
    })
    .sort('-dateStarted')
    .populate('customer', 'displayName')
    .exec(function (err, rents) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(rents);
      }
    });
};

/**
 * List of cars and number of times they were rented
 */
exports.countCars = function (req, res) {
  Rent.aggregate(
    { $group:
      { _id: '$car', totalRents: { $sum: 1 } }
    },
    function (err, aggResult) {
      if (err) {
        return res.status(500).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.json(aggResult);
      }
    }
  );
};

/**
 * Average profit per last 60 minutes
 */
exports.avgProfitPerHr = function (req, res) {
  let dateNow = new Date();
  let date60MinsAgo = new Date();
  date60MinsAgo.setSeconds(dateNow.getSeconds() - 3600);
  Rent
  .aggregate([
    {
      $match: {
        dateEnded: {
          $gte: date60MinsAgo,
          $lte: dateNow
        }
      }
    }, {
      $group: {
        _id: null,
        profit: {
          $sum: '$profit'
        }
      }
    }
  ])
  .exec(function (err, rents) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (rents && rents.length > 0) {
        rents[0].profit /= 60;
        return res.json(rents[0]);
      } else {
        return res.json({ _id: null, profit: 0 });
      }
    }
  });
};

exports.nRentsLast3Hrs = function (req, res) {
  let dateNow = new Date();
  let date3HrsAgo = new Date();
  date3HrsAgo.setSeconds(dateNow.getSeconds() - 10800);
  // Because of the following problem all seconds must be set to zero:
  // Graph one refresh:
  // Rent 0: 13:35:51 <= 13:36:15 <= 13:36:51 at 144
  // Rent 1: 13:36:16 <= 13:37:15 <= 13:38:16 at 145
  // Rent 1: 13:36:16 <= 13:38:15 <= 13:38:16 at 146
  // Rent 2: 13:45:2 <= 13:45:15 <= 13:46:2 at 153
  // Graph at another refresh:
  // Rent 0: 13:35:51 <= 13:36:17 <= 13:36:51 at 144
  // Rent 1: 13:36:16 <= 13:36:17 <= 13:38:16 at 144
  // Rent 1: 13:36:16 <= 13:37:17 <= 13:38:16 at 145
  // Rent 2: 13:45:2 <= 13:45:17 <= 13:46:2 at 153
  // 13:36:15 at one refresh, 13:36:17 at another, while
  // rent is at 16 seconds
  // Result was that graph was changing between refreshes in
  // weird ways
  date3HrsAgo.setSeconds(0);
  dateNow.setSeconds(0);
  Rent
  .aggregate([
    {
      $project: {
        dateEnded: {
          $ifNull: ['$dateEnded', new Date()]
        },
        dateStarted: true
      }
    },
    {
      $match: {
        $and: [
          {
            dateEnded: {
              $gte: date3HrsAgo
            }
          },
          {
            dateStarted: {
              $lte: dateNow
            }
          }
        ]
      }
    }
  ])
  .exec(function (err, rents) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (!rents) {
        return res.json({
          yAxis: [],
          startDate: date3HrsAgo
        });
      }
      // Fill array with zeros on Y axis and prepare X axis
      // let data = [];
      // for (let i = 0; i < 180; i++) {
        // data.push([new Date(date3HrsAgo), 0]);
        // data[i][0].setSeconds(data[i][0].getSeconds() + (i * 60));
      // }
      let data = Array.apply(null, Array(180)).map(Number.prototype.valueOf, 0);
      for (let i = 0; i < rents.length; i++) {
        let rent = rents[i];
        // If rent hasnt finished yet set temporary end now - done by Mongoose
        // if (!rent.dateEnded) {
        //   rent.dateEnded = dateNow;
        // }
        rent.dateStarted.setSeconds(0);
        rent.dateEnded.setSeconds(0);

        let currentGraphPos = new Date(date3HrsAgo);
        for (var j = 0; j < 180; j++) {
          // Move along X axis (time) and check if rent is still active
          // If rent is still active at this point ...
          if (
            currentGraphPos.getTime() >= rent.dateStarted.getTime() &&
            currentGraphPos.getTime() <= rent.dateEnded.getTime()
          ) {
            // ... increase number of active rents at this point
            // data[j][1] += 1;
            data[j] += 1;
          }
          currentGraphPos.setSeconds(currentGraphPos.getSeconds() + 60);
        }
      }
      return res.json({
        yAxis: data,
        startDate: date3HrsAgo
      });
    }
  });
};

exports.nRentsPerCar = function (req, res) {
  // TODO: why is entire car object among req?
  let dateNow = new Date();
  let date1WeekAgo = new Date();
  dateNow.setSeconds(0);
  date1WeekAgo.setSeconds(dateNow.getSeconds() - 604800);
  let carId = mongoose.Types.ObjectId(req.params.carId);
  Rent
  .aggregate([
    {
      $project: {
        dateEnded: {
          $ifNull: ['$dateEnded', dateNow]
        },
        dateStarted: true,
        car: true,
        duration: true // TODO: REMOVE AFTER DEBUGGING
      }
    },
    {
      $match: {
        $and: [
          {
            dateEnded: {
              $gte: date1WeekAgo
            }
          }, {
            dateStarted: {
              $lte: dateNow
            }
          }, {
            car: carId
          }
        ]
      }
    }
  ])
  .exec(function (err, rents) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (!rents) {
        return res.json({ graphData: {} });
      }
      let data = {};
      for (let i = 0; i < rents.length; i++) {
        let rent = rents[i];
        rent.dateStarted.setSeconds(0);
        rent.dateEnded.setSeconds(0);

        let commonIntervalDuration = 1;
        let commonIntervalStart;
        let commonIntervalEnd;
        let sectionStart = new Date(rent.dateStarted);
        sectionStart.setMinutes(0);
        sectionStart.setSeconds(0);
        let sectionEnd = new Date(sectionStart);
        sectionEnd.setSeconds(sectionEnd.getSeconds() + 3600);
        console.log('Rent start: ' + rent.dateStarted);
        console.log('Rent end: ' + rent.dateEnded);

        while (true) {
          console.log('Section start: ' + sectionStart);
          console.log('Section end: ' + sectionEnd);

          if (rent.dateStarted > sectionStart) {
            commonIntervalStart = rent.dateStarted;
          } else {
            commonIntervalStart = sectionStart;
          }
          if (rent.dateEnded < sectionEnd) {
            commonIntervalEnd = rent.dateEnded;
          } else {
            commonIntervalEnd = sectionEnd;
          }
          console.log('Common start: ' + commonIntervalStart);
          console.log('Common end: ' + commonIntervalEnd);
          commonIntervalDuration = (commonIntervalEnd.getTime() - commonIntervalStart.getTime()) / 1000;
          if (commonIntervalDuration < 1) {
            break;
          }
          if (data[sectionStart]) {
            data[sectionStart] += commonIntervalDuration / 36;
          } else {
            data[sectionStart] = commonIntervalDuration / 36;
          }
          console.log(commonIntervalDuration);
          sectionStart.setSeconds(sectionStart.getSeconds() + 3600);
          sectionEnd.setSeconds(sectionEnd.getSeconds() + 3600);
        }
        console.log('Rent duration: ' + rent.duration);
        console.log('------------------');
      }
      console.log(data);
      return res.json({ graphData: data });
    }
  });
};

// function debugPrint(i, a, x, b, j) {
//   console.log('Rent ' + i + ': ' + printTime(a) + ' <= ' + printTime(x) + ' <= ' + printTime(b) + ' at ' + j);
// }

// function printTime(d) {
//   return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
// }

/**
 * Rent middleware
 */
exports.rentByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Rent is invalid'
    });
  }

  Rent
    .findById(id)
    .populate('car', ['name', 'tariffGroup'])
    .populate('customer', 'displayName')
    .exec(function (err, rent) {
      if (err) {
        return next(err);
      } else if (!rent) {
        return res.status(404).send({
          message: 'No rent with that identifier has been found'
        });
      }
      req.rent = rent;
      next();
    });
};

exports.rentByID_S = function (id) {
  let query = Rent
    .findById(id)
    .populate({
      path: 'car',
      select: 'tariffGroup',
      model: 'Car',
      populate: {
        model: 'TariffGroup',
        path: 'tariffGroup',
        select: 'tariffs'
      }
    });

  return query.exec();
};
