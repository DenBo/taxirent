(function () {
  'use strict';

  angular
    .module('tariffGroups.admin')
    .controller('TariffGroupsAdminListController', TariffGroupsAdminListController);

  TariffGroupsAdminListController.$inject = ['TariffGroupsService', 'TariffsService'];

  function TariffGroupsAdminListController(TariffGroupsService, TariffsService) {
    var vm = this;

    const arrayToObject = (arr, keyField) =>
    Object.assign({}, ...arr.map(item => ({ [item[keyField]]: item })));

    vm.tariffsById = {};
    vm.tariffGroups = TariffGroupsService.query();
    // TODO: only get required tariffs, not all of them to minimize database usage
    vm.tariffs = TariffsService.query(function () {
      vm.tariffsById = arrayToObject(angular.fromJson(vm.tariffs), '_id');
    });
  }
}());
