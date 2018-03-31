(function () {
  'use strict';

  angular
    .module('tariffGroups.admin')
    .controller('TariffGroupsAdminListController', TariffGroupsAdminListController);

  TariffGroupsAdminListController.$inject = ['TariffGroupsService'];

  function TariffGroupsAdminListController(TariffGroupsService) {
    var vm = this;

    vm.tariffGroups = TariffGroupsService.query();
  }
}());
