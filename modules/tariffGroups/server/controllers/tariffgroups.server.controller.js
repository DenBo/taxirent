'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  TariffGroup = mongoose.model('TariffGroup'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a tariffGroup
 */
exports.create = function (req, res) {
  var tariffGroup = new TariffGroup(req.body);
  tariffGroup.tariff = req.tariff;

  tariffGroup.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tariffGroup);
    }
  });
};

/**
 * Show the current tariffGroup
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var tariffGroup = req.tariffGroup ? req.tariffGroup.toJSON() : {};

  res.json(tariffGroup);
};

/**
 * Update a tariffGroup
 */
exports.update = function (req, res) {
  var tariffGroup = req.tariffGroup;

  tariffGroup.tariff = req.body.tariff;

  tariffGroup.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tariffGroup);
    }
  });
};

/**
 * Delete a tariffGroup
 */
exports.delete = function (req, res) {
  var tariffGroup = req.tariffGroup;

  tariffGroup.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tariffGroup);
    }
  });
};

/**
 * List of TariffGroups
 */
exports.list = function (req, res) {
  TariffGroup.find().sort('-class').exec(function (err, tariffGroups) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tariffGroups);
    }
  });
};

/**
 * TariffGroup middleware
 */
exports.tariffGroupByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'TariffGroup is invalid'
    });
  }

  TariffGroup.findById(id).exec(function (err, tariffGroup) {
    if (err) {
      return next(err);
    } else if (!tariffGroup) {
      return res.status(404).send({
        message: 'No tariffGroup with that identifier has been found'
      });
    }
    req.tariffGroup = tariffGroup;
    next();
  });
};
