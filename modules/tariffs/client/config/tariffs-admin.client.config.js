(function () {
  'use strict';

  // Configuring the Tariffs Admin module
  angular
    .module('tariffs.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Tariffs',
      state: 'admin.tariffs.list'
    });
  }
}());
