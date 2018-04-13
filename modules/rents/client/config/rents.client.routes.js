(function () {
  'use strict';

  angular
    .module('rents.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('rents', {
        abstract: true,
        url: '/rents',
        template: '<ui-view/>'
      })
      .state('rents.list', {
        url: '',
        templateUrl: '/modules/rents/client/views/list-rents.client.view.html',
        controller: 'RentsListController',
        controllerAs: 'vm'
      })
      .state('rents.view', {
        url: '/:rentId',
        templateUrl: '/modules/rents/client/views/view-rent.client.view.html',
        controller: 'RentsController',
        controllerAs: 'vm',
        resolve: {
          rentResolve: getRent
        },
        data: {
          pageTitle: '{{ rentResolve.title }}'
        }
      })
      .state('rents.create', {
        url: '/create/:carId',
        templateUrl: '/modules/rents/client/views/form-rent.client.view.html',
        controller: 'RentsCreateController',
        controllerAs: 'vm',
        data: {
          roles: ['user', 'admin']
        },
        resolve: {
          rentResolve: newRent,
          carResolve: getCar
        }
      });
  }

  getRent.$inject = ['$stateParams', 'RentsService'];

  function getRent($stateParams, RentsService) {
    return RentsService.get({
      rentId: $stateParams.rentId
    }).$promise;
  }

  newRent.$inject = ['RentsService'];

  function newRent(RentsService) {
    return new RentsService();
  }

  getCar.$inject = ['$stateParams', 'CarsService'];

  function getCar($stateParams, CarsService) {
    return CarsService.get({
      carId: $stateParams.carId
    }).$promise;
  }
}());
