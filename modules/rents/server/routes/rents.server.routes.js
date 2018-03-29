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

  // Single rent routes
  app.route('/api/rents/:rentId').all(rentsPolicy.isAllowed)
    .get(rents.read)
    .put(rents.update)
    .delete(rents.delete);

  // Finish by binding the rent middleware
  app.param('rentId', rents.rentByID);
};
