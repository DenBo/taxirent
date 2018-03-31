(function () {
  'use strict';

  angular
    .module('tariffs.admin')
    .controller('TariffsAdminController', TariffsAdminController);

  TariffsAdminController.$inject = ['$scope', '$state', '$window', 'tariffResolve', 'Authentication', 'Notification'];

  function TariffsAdminController($scope, $state, $window, tariff, Authentication, Notification) {
    var vm = this;

    vm.tariff = tariff;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Tariff
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.tariff.$remove(function () {
          $state.go('admin.tariffs.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Tariff deleted successfully!' });
        });
      }
    }

    // Save Tariff
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.tariffForm');
        return false;
      }

      // Create a new tariff, or update the current instance
      vm.tariff.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.tariffs.list'); // should we send the User to the list or the updated Tariff's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Tariff saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Tariff save error!' });
      }
    }
  }
}());
