(function () {
  'use strict';

  angular
    .module('tariffs')
    .controller('TariffsController', TariffsController);

  TariffsController.$inject = ['$scope', 'tariffResolve', 'Authentication'];

  function TariffsController($scope, tariff, Authentication) {
    var vm = this;

    vm.tariff = tariff;
    vm.authentication = Authentication;

  }
}());
