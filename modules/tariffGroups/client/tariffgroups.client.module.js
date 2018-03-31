(function (app) {
  'use strict';

  app.registerModule('tariffGroups', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('tariffGroups.admin', ['core.admin']);
  app.registerModule('tariffGroups.admin.routes', ['core.admin.routes']);
  app.registerModule('tariffGroups.services');
  app.registerModule('tariffGroups.routes', ['ui.router', 'core.routes', 'tariffGroups.services']);
}(ApplicationConfiguration));
