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
    vm.authentication = Authentication;
    vm.getTotalProfit = getTotalProfit;

    function getTotalProfit() {
      var sum = 0;
      for (var i = 0; i < vm.rents.length; i++) {
        sum += vm.rents[i].profit;
      }
      return sum;
    }
  }
}());
