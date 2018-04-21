(function () {
  'use strict';

  angular
    .module('cars')
    .controller('CarsListController', CarsListController);

  CarsListController.$inject = ['$scope', '$state', '$window', 'CarsService', 'ActiveRentsService', 'Authentication', 'Notification'];

  function CarsListController($scope, $state, $window, CarsService, ActiveRentsService, Authentication, Notification) {
    var vm = this;

    vm.cars = {};
    vm.cancelRent = cancelRent;

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
                car.activeRent = activeRent;  // For cancelling
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

  /**
   * Cancel existing rent
   */
    function cancelRent(car) {
      if (!car.activeRent) {
        Notification.error({ message: '<i class="glyphicon glyphicon-ok"></i> An error has occured!' });
        return;
      }
      let activeRent = car.activeRent;
      console.log(activeRent);
      if ($window.confirm('Are you sure you want to cancel?')) {
        ActiveRentsService.cancel({}, activeRent, function () {
          $state.go('home');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Rent cancelled successfully!' });
        });
      }
    }
  }
}());
