(function () {
  'use strict';

  angular
    .module('tariffGroups.admin')
    .controller('TariffGroupsAdminListController', TariffGroupsAdminListController);

  TariffGroupsAdminListController.$inject = ['TariffGroupsService', 'TariffsService'];

  function TariffGroupsAdminListController(TariffGroupsService, TariffsService) {
    var vm = this;

    // ALTERNATIVE: USE POPULATE FUNCTION IN MONGOOSE to fill ids with objects retrieved from db
    // Downsides: duplication

    const arrayToObject = (arr, keyField) =>
    Object.assign({}, ...arr.map(item => ({ [item[keyField]]: item })));

    vm.tariffsById = {};
    vm.convertPrice = convertPrice;
    vm.tariffGroups = TariffGroupsService.query(function () {

      // Create a set of id's of tariffs that need to be retrieved from db
      const tariffIdsToRetrieve = new Set();
      for (var i = 0; i < vm.tariffGroups.length; i++) {
        for (var j = 0; j < vm.tariffGroups[i].tariffs.length; j++) {
          tariffIdsToRetrieve.add(vm.tariffGroups[i].tariffs[j]);
        }
      }

      // Convert array to map for easier access, make tarif id map key and tarif object map value
      // Only get required tariffs, not all of them to minimize database usage
      vm.tariffs = TariffsService.subset({}, Array.from(tariffIdsToRetrieve), function () {
        vm.tariffsById = arrayToObject(angular.fromJson(vm.tariffs), '_id');
      });
    });
  }

  function convertPrice(priceCents) {
    return (priceCents / 100).toFixed(2);
  }
}());
