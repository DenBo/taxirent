(function () {
  'use strict';

  angular
    .module('cars')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // menuService.addMenuItem('topbar', {
    //   title: 'Cars',
    //   state: 'cars',
    //   type: 'dropdown',
    //   roles: ['*']
    // });

    // Add the dropdown list item
    // menuService.addSubMenuItem('topbar', 'cars', {
    //   title: 'List Cars',
    //   state: 'cars.list',
    //   roles: ['*']
    // });
  }
}());
