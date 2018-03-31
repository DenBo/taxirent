(function () {
  'use strict';

  angular
    .module('tariffGroups')
    .controller('TariffGroupsController', TariffGroupsController);

  TariffGroupsController.$inject = ['$scope', 'tariffGroupResolve', 'Authentication'];

  function TariffGroupsController($scope, tariffGroup, Authentication) {
    var vm = this;

    vm.tariffGroup = tariffGroup;
    vm.authentication = Authentication;

  }
}());
