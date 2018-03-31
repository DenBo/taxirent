(function () {
  'use strict';

  angular
    .module('rents')
    .controller('RentsListController', RentsListController);

  RentsListController.$inject = ['RentsService'];

  function RentsListController(RentsService) {
    var vm = this;

    vm.rents = RentsService.query();
  }
}());
