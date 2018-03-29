'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Rent = mongoose.model('Rent'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a rent
 */
exports.create = function (req, res) {
  var rent = new Rent(req.body);
  rent.customer = req.user;
  rent.car = req.car;

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
  .populate('car', 'name')
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
