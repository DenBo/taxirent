'use strict';

/**
 * Module dependencies
 */
var activeRentsPolicy = require('../policies/activerents.server.policy'),
  activeRents = require('../controllers/activerents.server.controller');

module.exports = function (app) {
  // Active rents collection routes
  app.route('/api/activeRents').all(activeRentsPolicy.isAllowed)
    .get(activeRents.list)
    .post(activeRents.create);

  // Single active rent routes
  app.route('/api/activeRents/:activeRentId').all(activeRentsPolicy.isAllowed)
    .get(activeRents.read)
    .put(activeRents.update)
    .delete(activeRents.delete);

  // Finish by binding the active rent middleware
  app.param('activeRentId', activeRents.activeRentByID);
};
