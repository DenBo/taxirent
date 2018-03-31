(function () {
  'use strict';

  // Configuring the Cars Admin module
  angular
    .module('cars.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Cars',
      state: 'admin.cars.list'
    });
  }
}());
