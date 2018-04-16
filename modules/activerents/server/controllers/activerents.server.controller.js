'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  ActiveRent = mongoose.model('ActiveRent'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  rentsController = require(path.resolve('./modules/rents/server/controllers/rents.server.controller')),
  globalVarsController = require(path.resolve('./modules/globalvars/server/controllers/globalvars.server.controller')),
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

exports.createLocal = function (rent) {
  var activeRent = new ActiveRent();
  activeRent.rent = rent;

  activeRent.save(function (err) {
    if (err) {
      return { message: errorHandler.getErrorMessage(err) };
    } else {
      return;
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

function deleteLocal(activeRent) {
  activeRent.remove(function (err) {
    if (err) {
      return {
        message: errorHandler.getErrorMessage(err)
      };
    } else {
      return;
    }
  });
}

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

/**
 * Scheduled tasks: check if rent has finished
 */
cron.schedule('*/5 * * * * *', function () {
  ActiveRent.find().populate({
    path: 'rent',
    model: 'Rent',
    populate: {
      path: 'car',
      select: 'tariffGroup',
      model: 'Car'
  //   populate: {
  //     path: 'tariffGroup',
  //     model: 'TariffGroup',
  //     populate: {
  //       path: 'tariffs',
  //       model: 'Tariff'
  //     }
  //   }
    }
  })
  .exec(function (err, activeRentsList) {
    if (err) {
      return;
    }
    console.log(activeRentsList);
    // var currentDate = new Date();
    // for (var i = 0; i < activeRentsList.length; i++) {
    //   var activeRent = activeRentsList[i];
    //   var rent = activeRent.rent;

    //   // Calculate date when rent will end from starting date and duration
    //   var dateEnded = new Date(activeRent.rent.dateStarted);
    //   dateEnded.setSeconds(dateEnded.getSeconds() + activeRent.rent.duration);
    //   // If rent has ended set date ended, remove it from active rents and
    //   // add rent profit to global profit
    //   if (currentDate >= dateEnded) {
    //     rent.dateEnded = dateEnded;
    //     rent.profit = rentsController.getPrice(rent.duration, rent.car.tariffGroup);
    //     err = rentsController.updateLocal(rent);
    //     if (err) return;
    //     err = deleteLocal(activeRent);
    //     if (err) return;
    //     err = globalVarsController.addToProfitLocal(rent.profit);
    //   }
    // }
  });
});
