(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$state', 'Authentication', 'GlobalVarsService', 'menuService'];

  function HeaderController($scope, $state, Authentication, GlobalVarsService, menuService) {
    var vm = this;

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');
    vm.profit = getProfit();

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
    }

    function getProfit() {
      GlobalVarsService.get().$promise
      .then(function (response) {
        vm.profit = response.profit;
      });
      return '';
    }
  }
}());
