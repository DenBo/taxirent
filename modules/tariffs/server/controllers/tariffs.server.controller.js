'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Tariff = mongoose.model('Tariff'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a tariff
 */
exports.create = function (req, res) {
  var tariff = new Tariff(req.body);

  tariff.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tariff);
    }
  });
};

/**
 * Show the current tariff
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var tariff = req.tariff ? req.tariff.toJSON() : {};

  res.json(tariff);
};

/**
 * Update a tariff
 */
exports.update = function (req, res) {
  var tariff = req.tariff;

  tariff.activeAfter = req.body.activeAfter;
  tariff.price = req.body.price;

  tariff.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tariff);
    }
  });
};

/**
 * Delete a tariff
 */
exports.delete = function (req, res) {
  var tariff = req.tariff;

  tariff.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tariff);
    }
  });
};

/**
 * List of Tariffs
 */
exports.list = function (req, res) {

  Tariff.find().sort('-activeAfter').exec(function (err, tariffs) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tariffs);
    }
  });
};

/**
 * Limited list of Tariffs
 */
exports.subset = function (req, res) {

  var idList = req.body;

  Tariff.find({
    '_id': { $in: idList }
  }).sort('-activeAfter').exec(function (err, tariffs) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(tariffs);
    }
  });
};

/**
 * Tariff middleware
 */
exports.tariffByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Tariff is invalid'
    });
  }

  Tariff.findById(id).exec(function (err, tariff) {
    if (err) {
      return next(err);
    } else if (!tariff) {
      return res.status(404).send({
        message: 'No tariff with that identifier has been found'
      });
    }
    req.tariff = tariff;
    next();
  });
};
