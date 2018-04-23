(function () {
  'use strict';

  angular
    .module('cars.admin')
    .controller('CarsAdminController', CarsAdminController);

  CarsAdminController.$inject = ['$scope', '$state', '$window', 'carResolve', 'tariffGroupsResolve', 'CarsService', 'Authentication', 'Notification'];

  function CarsAdminController($scope, $state, $window, car, tariffGroups, CarsService, Authentication, Notification) {
    var vm = this;

    vm.car = car;
    vm.tariffGroups = tariffGroups;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.retire = retire;
    // In Angular 1.3+ date must be an actual Date object, not a string representation
    vm.car.dateManufactured = new Date(vm.car.dateManufactured);
    // TODO: still throws error on saving (but loads ok now), but seems to save ok

    // Remove existing Car
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.car.$remove(function () {
          $state.go('admin.cars.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Car deleted successfully!' });
        });
      }
    }

    // Save Car
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.carForm');
        return false;
      }

      // Create a new car, or update the current instance
      vm.car.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.cars.list'); // should we send the User to the list or the updated Car's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Car saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Car save error!' });
      }
    }

    // Retire existing car
    function retire() {
      if ($window.confirm('Are you sure you want to retire this car?')) {
        CarsService.get({ carId: vm.car._id }).$promise.then(succGetCarCbk, errGetCarCbk);
      }

      function succGetCarCbk(res) {
        let car = res;
        if (!car) {
          Notification.error({ message: '<i class="glyphicon glyphicon-remove-circle"></i> Error retiring car!' });
          return;
        }
        car.status = 'retired';
        car.createOrUpdate()
          .then(succUpdCarCbk)
          .catch(errUpdCarCbk);
      }

      function errGetCarCbk(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Error while getting car!' });
      }

      function succUpdCarCbk(res) {
        vm.car.status = 'retired';
        $state.go('admin.cars.list');
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Car retired successfully!' });
      }

      function errUpdCarCbk(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Error while updating car!' });
      }
    }
  }
}());
