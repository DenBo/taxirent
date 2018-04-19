'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  GlobalVar = mongoose.model('GlobalVar'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a global var
 */
exports.create = function (req, res) {

  // Check if global vars already exists
  let query = GlobalVar.findOne();
  let result = query.exec();

  result.then(
    // Success querying global var
    (globalVar) => {
      // If it already exists
      if (globalVar) {
        return res.status(409).send({
          message: 'There can only be one document in collection globalvars'
        });
      }
      // If it doesn't exist yet create new
      globalVar = new GlobalVar(req.body);
      globalVar.save(function (err) {
        if (err) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(err)
          });
        } else {
          res.json(globalVar);
        }
      });
    },
    // Error while querying for global var
    (err) => {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

/**
 * Show the current global var
 */
exports.read = function (req, res) {
  GlobalVar.findOne().exec(function (err, globalVar) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (!globalVar) {
        globalVar = new GlobalVar();
        globalVar.save(function (err) {
          if (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(globalVar);
          }
        });
      } else {
        res.json(globalVar);
      }
    }
  });
};

/**
 * Update a global var
 */
exports.update = function (req, res) {
  var globalVar = req.globalVar;

  globalVar.profit = req.body.profit;

  globalVar.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(globalVar);
    }
  });
};

/**
 * Delete a global var
 */
exports.delete = function (req, res) {
  var globalVar = req.globalVar;

  globalVar.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(globalVar);
    }
  });
};

/**
 * Functions for profit property
 */
exports.getProfit = function (req, res) {
  GlobalVar.findOne().select('profit -_id').exec(function (err, globalVar) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      if (!globalVar) {
        globalVar = new GlobalVar();
        globalVar.save(function (err) {
          if (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          } else {
            res.json(globalVar);
          }
        });
      } else {
        res.json(globalVar);
      }
    }
  });
};

/**
 * Add amount to profit on server
 */
exports.addToProfit_S = function (amount) {
  return new Promise((resolve, reject) => {
    let query = GlobalVar.findOne();
    let result = query.exec();

    result.then(
      // On success
      function (globalVar) {
        if (!globalVar) {
          globalVar = new GlobalVar();
        }
        return add(globalVar, amount);
      },
      // On failure
      function (err) {
        return reject(err);
      });
  });
};

function add(globalVar, amount) {
  return new Promise((resolve, reject) => {
    let sum = globalVar.profit + amount;
    // if (sum < 0) {
    //  return reject('Profit cannot be negative');
    // } else {
    globalVar.profit = sum;
    globalVar.save(function (err) {
      if (err) {
        return reject(err);
      } else {
        return resolve(globalVar);
      }
    });
  });
}
