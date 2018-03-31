(function () {
  'use strict';

  angular
    .module('cars.admin')
    .controller('CarsAdminController', CarsAdminController);

  CarsAdminController.$inject = ['$scope', '$state', '$window', 'carResolve', 'Authentication', 'Notification'];

  function CarsAdminController($scope, $state, $window, car, Authentication, Notification) {
    var vm = this;

    vm.car = car;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

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
  }
}());
