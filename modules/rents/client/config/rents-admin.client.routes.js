(function () {
  'use strict';

  angular
    .module('rents.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.rents', {
        abstract: true,
        url: '/rents',
        template: '<ui-view/>'
      })
      .state('admin.rents.list', {
        url: '',
        templateUrl: '/modules/rents/client/views/admin/list-rents.client.view.html',
        controller: 'RentsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.rents.create', {
        url: '/create/:carId',
        templateUrl: '/modules/rents/client/views/admin/form-rent.client.view.html',
        controller: 'RentsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          rentResolve: newRent,
          carResolve: getCar
        }
      })
      .state('admin.rents.edit', {
        url: '/:rentId/edit',
        templateUrl: '/modules/rents/client/views/admin/form-rent.client.view.html',
        controller: 'RentsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ rentResolve.title }}'
        },
        resolve: {
          rentResolve: getRent
        }
      });
  }

  getRent.$inject = ['$stateParams', 'RentsService'];

  function getRent($stateParams, RentsService) {
    return RentsService.Basic.get({
      rentId: $stateParams.rentId
    }).$promise;
  }

  newRent.$inject = ['RentsService'];

  function newRent(RentsService) {
    return new RentsService.Basic();
  }

  getCar.$inject = ['$stateParams', 'CarsService'];

  function getCar($stateParams, CarsService) {
    return CarsService.get({
      carId: $stateParams.carId
    }).$promise;
  }
}());
