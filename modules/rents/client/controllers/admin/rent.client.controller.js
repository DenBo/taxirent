(function () {
  'use strict';

  angular
    .module('rents.admin')
    .controller('RentsAdminController', RentsAdminController);

  RentsAdminController.$inject = ['$scope', '$state', '$window', 'rentResolve', 'carResolve', 'Authentication', 'Notification'];

  function RentsAdminController($scope, $state, $window, rent, car, Authentication, Notification) {
    var vm = this;

    vm.rent = rent;
    vm.car = car;
    vm.duration = vm.duration ? parseDate(vm.rent.duration) : vm.duration;
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

      vm.rent.dateStarted = new Date(); // TODO: add field
      vm.rent.customer = vm.authentication.user;   // In case of new rent
      vm.rent.car = vm.car;   // In case of new rent
      vm.rent.duration = getDuration(vm.duration);
      vm.rent.dateEnded = new Date(); // TODO: add field
      vm.rent.profit = 0; // TODO: add field

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

    function parseDate(duration) {
      var hrs = Math.trunc(duration / 3600);
      var mins = Math.trunc((duration % 3600) / 60);
      var secs = duration - (hrs * 3600) - (mins * 60);

      return Date.parse(
        '04 Dec 1995 ' +
        hrs +
        ':' +
        mins +
        ':' +
        secs +
        ' GMT');
    }

    function getDuration(date) {
      return date.getHours() * 3600 +
      date.getMinutes() * 60 +
      date.getSeconds();
    }
  }
}());
