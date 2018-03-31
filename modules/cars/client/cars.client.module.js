(function (app) {
  'use strict';

  app.registerModule('cars', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('cars.admin', ['core.admin']);
  app.registerModule('cars.admin.routes', ['core.admin.routes']);
  app.registerModule('cars.services');
  app.registerModule('cars.routes', ['ui.router', 'core.routes', 'cars.services']);
}(ApplicationConfiguration));
