(function (app) {
  'use strict';

  app.registerModule('tariffs', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('tariffs.admin', ['core.admin']);
  app.registerModule('tariffs.admin.routes', ['core.admin.routes']);
  app.registerModule('tariffs.services');
  app.registerModule('tariffs.routes', ['ui.router', 'core.routes', 'tariffs.services']);
}(ApplicationConfiguration));
