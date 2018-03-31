(function () {
  'use strict';

  angular
    .module('cars.admin')
    .controller('CarsAdminListController', CarsAdminListController);

  CarsAdminListController.$inject = ['CarsService'];

  function CarsAdminListController(CarsService) {
    var vm = this;

    vm.cars = CarsService.query();
  }
}());
