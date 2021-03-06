'use strict';

/**
 * Module dependencies
 */
var rentsPolicy = require('../policies/rents.server.policy'),
  rents = require('../controllers/rents.server.controller');

module.exports = function (app) {
  // Rents collection routes
  app.route('/api/rents').all(rentsPolicy.isAllowed)
    .get(rents.list)
    .post(rents.create);

  app.route('/api/rents/bycar').all(rentsPolicy.isAllowed)
    .post(rents.byCar);

  app.route('/api/rents/car_usage').all(rentsPolicy.isAllowed)
    .get(rents.countCars);

  app.route('/api/rents/avgProfitPerHr').all(rentsPolicy.isAllowed)
    .get(rents.avgProfitPerHr);

  app.route('/api/rents/nRentsLast3Hrs').all(rentsPolicy.isAllowed)
    .get(rents.nRentsLast3Hrs);

  app.route('/api/rents/nRentsPerCar/:carId').all(rentsPolicy.isAllowed)
  .get(rents.nRentsPerCar);

  // Single rent routes
  app.route('/api/rents/:rentId').all(rentsPolicy.isAllowed)
    .get(rents.read)
    .put(rents.update)
    .delete(rents.delete);

  // Finish by binding the rent middleware
  app.param('rentId', rents.rentByID);
};
