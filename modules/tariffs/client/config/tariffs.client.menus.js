(function () {
  'use strict';

  angular
    .module('tariffs')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Tariffs',
      state: 'tariffs',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'tariffs', {
      title: 'List Tariffs',
      state: 'tariffs.list',
      roles: ['*']
    });
  }
}());
