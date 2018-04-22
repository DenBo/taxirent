(function () {
  'use strict';

  angular
    .module('cars.admin')
    .controller('CarsAdminListController', CarsAdminListController);

  CarsAdminListController.$inject = ['$state', 'CarsService', 'GlobalVarsService', 'Notification'];

  function CarsAdminListController($state, CarsService, GlobalVarsService, Notification) {
    var vm = this;

    vm.cars = CarsService.query();
    vm.buy = buy;
    vm.profit = getProfit();
    vm.cantBuy = cantBuy;

    function cantBuy() {
      return vm.profit < 100;
    }

    // Save Car
    function buy() {
      if (cantBuy()) {
        return;
      }
      let car = new CarsService();
      car.random = true;  // Let server know we want a random car
      // Create a new car, or update the current instance
      car.createOrUpdate()
        .then(successCallback)
        .catch(errorCallback);

      function successCallback(res) {
        $state.reload();
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Car saved successfully!' });
      }

      function errorCallback(res) {
        Notification.error({ message: res.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Car save error!' });
      }
    }

    function getProfit() {
      GlobalVarsService.profit.get().$promise
      .then(function (response) {
        vm.profit = (response.profit / 100).toFixed(2);
      });
      return 0;
    }
  }
}());
