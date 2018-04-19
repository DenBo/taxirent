(function () {
  'use strict';

  angular
    .module('cars')
    .controller('CarsListController', CarsListController);

  CarsListController.$inject = ['$scope', 'CarsService', 'ActiveRentsService'];

  function CarsListController($scope, CarsService, ActiveRentsService) {
    var vm = this;

    vm.cars = {};

    display();

    function display() {
      return Promise.all([
        CarsService.query().$promise,
        ActiveRentsService.query().$promise
      ])
      .then(function (values) {
        vm.cars = values[0];
        var activeRents = values[1];
        angular.forEach(vm.cars, function (car) {
          car.rented = false;
          angular.forEach(activeRents, function (activeRent) {
            if (car._id === activeRent.rent.car) {
              car.rented = true;
            }
          });
        });
        $scope.$apply();
      });
    }

    function convertDate(date) {
      return new Date(date);
    }
  }
}());
