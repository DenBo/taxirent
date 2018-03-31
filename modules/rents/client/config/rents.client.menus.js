(function () {
  'use strict';

  angular
    .module('rents')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Rents',
      state: 'rents',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'rents', {
      title: 'List Rents',
      state: 'rents.list',
      roles: ['*']
    });
  }
}());
