(function () {
  'use strict';

  angular
    .module('cars')
    .controller('CarsController', CarsController);

  CarsController.$inject = ['$scope', 'carResolve', 'rentsResolve', 'Authentication'];

  function CarsController($scope, car, rents, Authentication) {
    var vm = this;

    vm.car = car;
    vm.rents = rents;
    console.log(rents);
    vm.authentication = Authentication;

  }
}());
