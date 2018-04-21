(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$state', '$interval', 'Authentication', 'GlobalVarsService', 'menuService'];

  function HeaderController($scope, $state, $interval, Authentication, GlobalVarsService, menuService) {
    var vm = this;

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');
    vm.profit = getProfit();

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    $interval(getProfit, 2000); // Refresh data from db on regular interval

    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
    }

    function getProfit() {
      GlobalVarsService.profit.get().$promise
      .then(function (response) {
        vm.profit = (response.profit / 100).toFixed(2);
      });
      return '';
    }
  }
}());
