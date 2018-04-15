(function (app) {
  'use strict';

  app.registerModule('activeRents', ['core']);// The core module is required for special route handling; see
  app.registerModule('activeRents.services');
}(ApplicationConfiguration));
