'use strict';

/**
 * Module dependencies
 */
var tariffsPolicy = require('../policies/tariffs.server.policy'),
  tariffs = require('../controllers/tariffs.server.controller');

module.exports = function (app) {
  // Tariffs collection routes
  app.route('/api/tariffs').all(tariffsPolicy.isAllowed)
    .get(tariffs.list)
    .post(tariffs.create);

  // Tariffs limited collection routes
  app.route('/api/tariffs/subset').all(tariffsPolicy.isAllowed)
    .post(tariffs.subset);

  // Single tariff routes
  app.route('/api/tariffs/:tariffId').all(tariffsPolicy.isAllowed)
    .get(tariffs.read)
    .put(tariffs.update)
    .delete(tariffs.delete);

  // Finish by binding the tariff middleware
  app.param('tariffId', tariffs.tariffByID);
};
