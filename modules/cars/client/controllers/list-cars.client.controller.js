(function () {
  'use strict';

  angular
    .module('cars')
    .controller('CarsListController', CarsListController);

  CarsListController.$inject = ['CarsService'];

  function CarsListController(CarsService) {
    var vm = this;

    vm.cars = CarsService.query();

    function convertDate(date) {
      return new Date(date);
    }
  }
}());
