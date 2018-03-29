'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke TariffGroups Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/tariffGroups',
      permissions: '*'
    }, {
      resources: '/api/tariffGroups/:tariffGroupId',
      permissions: '*'
    }]
  }]);
};

