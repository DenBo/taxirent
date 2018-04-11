(function () {
  'use strict';

  angular
    .module('tariffGroups.admin')
    .controller('TariffGroupsAdminController', TariffGroupsAdminController);

  TariffGroupsAdminController.$inject = ['$scope', '$state', '$window', 'tariffGroupResolve', 'tariffsResolve', 'Authentication', 'Notification'];

  function TariffGroupsAdminController($scope, $state, $window, tariffGroup, tariffs, Authentication, Notification) {
    var vm = this;

    vm.tariffGroup = tariffGroup;
    vm.tariffs = tariffs;
    vm.authentication = Authentication;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Tariff Group
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.tariffGroup.$remove(function () {
          $state.go('admin.tariffGroups.list');
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Tariff class deleted successfully!' });
        });
      }
    }

    // Save Tariff Group
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.tariffGroupForm');
        return false;
      }

      // Create a new tariff group, or update the current instance
      vm.tariffGroup.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.go('admin.tariffGroups.list'); // should we send the User to the list or the updated TariffGroup's view?
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Tariff class saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Tariff class save error!' });
      }
    }
  }
}());
