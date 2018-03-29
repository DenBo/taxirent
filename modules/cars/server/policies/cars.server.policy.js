'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Cars Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/cars',
      permissions: '*'
    }, {
      resources: '/api/cars/:carId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/cars',
      permissions: ['get']
    }, {
      resources: '/api/cars/:carId',
      permissions: ['get']
    }]
  }]);
};
