(function () {
  'use strict';

  angular
    .module('tariffs')
    .controller('TariffsListController', TariffsListController);

  TariffsListController.$inject = ['TariffsService'];

  function TariffsListController(TariffsService) {
    var vm = this;

    vm.tariffs = TariffsService.query();
  }
}());
