'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Rent = mongoose.model('Rent'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  activeRentsController = require(path.resolve('./modules/activerents/server/controllers/activerents.server.controller'));

/**
 * Create a rent
 */
exports.create = function (req, res) {
  var rent = new Rent(req.body);
  rent.customer = req.user;

  rent.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      err = activeRentsController.createLocal(rent);
      if (err) {
        return res.status(422).send({
          message: err.message
        });
      } else {
        res.json(rent);
      }
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

exports.updateLocal = function (rent) {
  rent.save(function (err) {
    if (err) {
      return {
        message: errorHandler.getErrorMessage(err)
      };
    } else {
      return;
    }
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

/**
 * Rent price
 */

exports.getPrice = function (dur, tariffGroup) {
  var price = 0;
  var prev_tariff_t = 0;

  for (var i = 0; i < tariffGroup.tariffs.length; i++) {
    var pricePerSec = tariffGroup.tariffs[i].price;
    // If this is last specified tariff apply its price to all remaining duration
    if (i === tariffGroup.tariffs.length - 1) {
      price += dur * pricePerSec;
      return price;
    }
    var tariffDur = tariffGroup.tariffs[i + 1].activeAfter - tariffGroup.tariffs[i].activeAfter;
    // If duration does not reach next tariff also apply all remaining duration
    if (dur <= tariffDur) {
      price += dur * pricePerSec;
      return price;
    }
    price += tariffDur * pricePerSec;
    dur -= tariffDur;
  }
  return price;
};
