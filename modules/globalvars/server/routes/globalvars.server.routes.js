'use strict';

/**
 * Module dependencies
 */
var globalVarsPolicy = require('../policies/globalvars.server.policy'),
  globalVars = require('../controllers/globalvars.server.controller');

module.exports = function (app) {
  app.route('/api/globalVars/').all(globalVarsPolicy.isAllowed)
    .get(globalVars.read)
    .put(globalVars.update)
    .delete(globalVars.delete);

  app.route('/api/globalVars/profit').all(globalVarsPolicy.isAllowed)
    .get(globalVars.getProfit);
};
