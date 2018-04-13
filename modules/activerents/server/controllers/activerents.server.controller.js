'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  ActiveRent = mongoose.model('ActiveRent'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an active rent
 */
exports.create = function (req, res) {
  var activeRent = new ActiveRent(req.body);
  activeRent.user = req.user;

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
  activeRent.car = req.body.car;

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
 * List of Active rents
 */
exports.list = function (req, res) {
  ActiveRent.find().exec(function (err, activeRents) {
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
