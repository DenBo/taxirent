'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Rents Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/rents',
      permissions: '*'
    }, {
      resources: '/api/rents/:rentId',
      permissions: '*'
    }, {
      resources: '/api/rents/bycar',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/rents',
      permissions: ['get']
    }, {
      resources: '/api/rents/:rentId',
      permissions: ['get']
    }]
  }, {
    roles: ['user', 'guest'],
    allows: [{
      resources: '/api/rents/bycar',
      permissions: ['post']
    }]
  }]);
};

/**
 * Check If Rents Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If a rent is being processed and the current user created it then allow viewing and cancelling
  if (req.rent && req.user && req.rent.customer && req.rent.customer.id === req.user.id) {
    // TODO only allow viewing
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
