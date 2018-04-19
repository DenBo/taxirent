(function () {
  'use strict';

  angular
    .module('tariffs.admin')
    .controller('TariffsAdminListController', TariffsAdminListController);

  TariffsAdminListController.$inject = ['TariffsService'];

  function TariffsAdminListController(TariffsService) {
    var vm = this;

    vm.tariffs = TariffsService.query();
    vm.convertPrice = convertPrice;
  }

  function convertPrice(priceCents) {
    return (priceCents / 100).toFixed(2);
  }
}());
