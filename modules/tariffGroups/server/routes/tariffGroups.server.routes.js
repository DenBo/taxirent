'use strict';

/**
 * Module dependencies
 */
var tariffGroupsPolicy = require('../policies/tariffgroups.server.policy'),
  tariffGroups = require('../controllers/tariffgroups.server.controller');

module.exports = function (app) {
  // TariffGroups collection routes
  app.route('/api/tariffGroups').all(tariffGroupsPolicy.isAllowed)
    .get(tariffGroups.list)
    .post(tariffGroups.create);

  // Single tariffGroup routes
  app.route('/api/tariffGroups/:tariffGroupId').all(tariffGroupsPolicy.isAllowed)
    .get(tariffGroups.read)
    .put(tariffGroups.update)
    .delete(tariffGroups.delete);

  // Finish by binding the tariffGroup middleware
  app.param('tariffGroupId', tariffGroups.tariffGroupByID);
};
