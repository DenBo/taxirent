(function () {
  'use strict';

  angular
    .module('cars')
    .controller('CarsController', CarsController);

  CarsController.$inject = ['$scope', 'carResolve', 'Authentication'];

  function CarsController($scope, car, Authentication) {
    var vm = this;

    vm.car = car;
    vm.authentication = Authentication;

  }
}());
