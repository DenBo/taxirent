(function (app) {
  'use strict';

  app.registerModule('rents', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('rents.admin', ['core.admin']);
  app.registerModule('rents.admin.routes', ['core.admin.routes']);
  app.registerModule('rents.services');
  app.registerModule('rents.routes', ['ui.router', 'core.routes', 'rents.services']);
}(ApplicationConfiguration));
