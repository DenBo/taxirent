(function () {
  'use strict';

  angular
    .module('cars')
    .controller('CarsListController', CarsListController);

  CarsListController.$inject = ['$scope', '$state', '$window', '$interval', 'CarsService', 'ActiveRentsService', 'RentsService', 'Authentication', 'Notification'];

  function CarsListController($scope, $state, $window, $interval, CarsService, ActiveRentsService, RentsService, Authentication, Notification) {
    var vm = this;

    vm.cars = {};
    vm.cancelRent = cancelRent;
    vm.nRentedCars = 0;
    vm.mostRentedCar = '?';
    vm.profitLastHour = '? €/min';

    display();

    $interval(display, 10000); // Refresh data from db on regular interval

    function display() {
      displayCarsAndCarInfo();
      displayAvgProfitPerHr();
    }

    function displayCarsAndCarInfo() {
      return Promise.all([
        CarsService.query().$promise,
        ActiveRentsService.query().$promise,
        RentsService.CarUsageStats.query().$promise
      ]).then(displaySuccCbk, displayErrCbk);
    }

    function displaySuccCbk(values) {
      vm.cars = values[0];
      let activeRents = values[1];
      let carUsage = values[2];

      // Check for each car if it is rented and add property
      // to it so that view can show it
      angular.forEach(vm.cars, function (car) {
        car.rented = 'false';
        angular.forEach(activeRents, function (activeRent) {
          if (car._id === activeRent.rent.car) {
            car.rented = 'true';
            // Guest will have username null
            if (Authentication.user && Authentication.user.username && activeRent.rent.customer.username === Authentication.user.username) {
              car.rented = 'byLogged';
              car.activeRent = activeRent;  // For cancelling
            }
          }
        });
      });

      // Count number of rented cars
      // TODO: Has to be adjusted if client can rent more than
      // one car at a time
      let n = 0;
      angular.forEach(activeRents, function (activeRent) {
        n++;
      });
      vm.nRentedCars = n;

      // Find out the most used car
      let mostRents = Math.max.apply(Math, carUsage.map(function (o) {
        return o.totalRents;
      }));
      var car = carUsage.find(function (o) {
        return o.totalRents === mostRents;
      });
      // Currently car object only has id and number of rents
      car = vm.cars.find(function (o) {
        return o._id === car._id;
      });
      vm.mostRentedCar = car.name;

      $scope.$apply();
    }

    function displayErrCbk(err) {
      Notification.error({ message: '<i class="glyphicon glyphicon-ok"></i> An error has occured!' });
    }

    function convertDate(date) {
      return new Date(date);
    }

    function displayAvgProfitPerHr() {
      RentsService.ProfitStats.get().$promise.then(
        function (rentProfitSum) {
          vm.profitLastHour = (rentProfitSum.profit / 100) + ' €/min';
        },
        function (err) {
          Notification.error({ message: '<i class="glyphicon glyphicon-ok"></i> An error has occured!' });
        }
      );
    }

  /**
   * Cancel existing rent
   */
    function cancelRent(car) {
      if (!car.activeRent) {
        Notification.error({ message: '<i class="glyphicon glyphicon-ok"></i> An error has occured!' });
        return;
      }
      let activeRentId = car.activeRent._id;
      if ($window.confirm('Are you sure you want to cancel?')) {
        ActiveRentsService.cancel({ activeRentId }, {}, function () {
          // All of the following methods are irrelevant with automatic refresh every 2 seconds
          // $timeout(function () {
            // anything you want can go here and will safely be run on the next digest.
            // any code in here will automatically have an apply run afterwards
          // });
          // $state.reload(); // Too noticeable
          // $state.go('home'); Does not refresh because we are already in this state
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Rent cancelled successfully!' });
        });
      }
    }
  }
}());
