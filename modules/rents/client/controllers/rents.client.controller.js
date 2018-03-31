(function () {
  'use strict';

  angular
    .module('rents')
    .controller('RentsController', RentsController);

  RentsController.$inject = ['$scope', 'rentResolve', 'Authentication'];

  function RentsController($scope, rent, Authentication) {
    var vm = this;

    vm.rent = rent;
    vm.authentication = Authentication;

  }
}());
