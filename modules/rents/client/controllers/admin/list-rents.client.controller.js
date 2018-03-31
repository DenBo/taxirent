(function () {
  'use strict';

  angular
    .module('rents.admin')
    .controller('RentsAdminListController', RentsAdminListController);

  RentsAdminListController.$inject = ['RentsService'];

  function RentsAdminListController(RentsService) {
    var vm = this;

    vm.rents = RentsService.query();
  }
}());
