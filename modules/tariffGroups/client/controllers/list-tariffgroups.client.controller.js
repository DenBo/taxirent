(function () {
  'use strict';

  angular
    .module('tariffGroups')
    .controller('TariffGroupsListController', TariffGroupsListController);

  TariffGroupsListController.$inject = ['TariffGroupsService'];

  function TariffGroupsListController(TariffGroupsService) {
    var vm = this;

    vm.tariffGroups = TariffGroupsService.query();
  }
}());
