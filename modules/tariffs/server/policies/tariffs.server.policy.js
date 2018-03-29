'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Tariffs Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/tariffs',
      permissions: '*'
    }, {
      resources: '/api/tariffs/:tariffId',
      permissions: '*'
    }]
  }]);
};
