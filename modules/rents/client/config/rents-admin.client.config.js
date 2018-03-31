(function () {
  'use strict';

  // Configuring the Rents Admin module
  angular
    .module('rents.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Rents',
      state: 'admin.rents.list'
    });
  }
}());
