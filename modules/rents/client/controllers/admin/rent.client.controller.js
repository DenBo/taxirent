(function () {
  'use strict';

  angular
    .module('rents.admin')
    .controller('RentsAdminController', RentsAdminController);

  RentsAdminController.$inject = ['$scope', '$state', '$window', 'rentResolve', 'Authentication', 'Notification'];

  function RentsAdminController($scope, $state, $window, rent, Authentication, Notification) {
    var vm = this;

    vm.rent = rent;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Rent
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.rent.$remove(function () {
          $state.go('admin.rents.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Rent deleted successfully!' });
        });
      }
    }

    // Save Rent
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.rentForm');
        return false;
      }

      // Create a new rent, or update the current instance
      vm.rent.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.rents.list'); // should we send the User to the list or the updated Rent's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Rent saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Rent save error!' });
      }
    }
  }
}());
