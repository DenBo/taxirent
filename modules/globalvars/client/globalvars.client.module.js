(function (app) {
  'use strict';

  app.registerModule('globalVars', ['core']);// The core module is required for special route handling; see
  app.registerModule('globalVars.services');
}(ApplicationConfiguration));
