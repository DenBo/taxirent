(function () {
  'use strict';

  angular
    .module('cars')
    .controller('CarsListController', CarsListController);

  CarsListController.$inject = ['$scope', 'CarsService', 'ActiveRentsService', 'Authentication'];

  function CarsListController($scope, CarsService, ActiveRentsService, Authentication) {
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
        let activeRents = values[1];

        angular.forEach(vm.cars, function (car) {
          car.rented = 'false';
          angular.forEach(activeRents, function (activeRent) {
            if (car._id === activeRent.rent.car) {
              car.rented = 'true';
              if (activeRent.rent.customer.username === Authentication.user.username) {
                car.rented = 'byLogged';
              }
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
