(function () {
  'use strict';

  angular
    .module('tariffGroups')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // menuService.addMenuItem('topbar', {
    //   title: 'Tariff Classes',
    //   state: 'tariffGroups',
    //   type: 'dropdown',
    //   roles: ['*']
    // });

    // Add the dropdown list item
    // menuService.addSubMenuItem('topbar', 'tariffGroups', {
    //   title: 'List Tariff Classes',
    //   state: 'tariffGroups.list',
    //   roles: ['*']
    // });
  }
}());
