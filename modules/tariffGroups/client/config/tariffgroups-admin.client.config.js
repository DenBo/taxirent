(function () {
  'use strict';

  // Configuring the TariffGroups Admin module
  angular
    .module('tariffGroups.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(Menus) {
    Menus.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Tariff Groups',
      state: 'admin.tariffGroups.list'
    });
  }
}());
