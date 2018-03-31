(function () {
  'use strict';

  angular
    .module('tariffs.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.tariffs', {
        abstract: true,
        url: '/tariffs',
        template: '<ui-view/>'
      })
      .state('admin.tariffs.list', {
        url: '',
        templateUrl: '/modules/tariffs/client/views/admin/list-tariffs.client.view.html',
        controller: 'TariffsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.tariffs.create', {
        url: '/create',
        templateUrl: '/modules/tariffs/client/views/admin/form-tariff.client.view.html',
        controller: 'TariffsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          tariffResolve: newTariff
        }
      })
      .state('admin.tariffs.edit', {
        url: '/:tariffId/edit',
        templateUrl: '/modules/tariffs/client/views/admin/form-tariff.client.view.html',
        controller: 'TariffsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ tariffResolve.title }}'
        },
        resolve: {
          tariffResolve: getTariff
        }
      });
  }

  getTariff.$inject = ['$stateParams', 'TariffsService'];

  function getTariff($stateParams, TariffsService) {
    return TariffsService.get({
      tariffId: $stateParams.tariffId
    }).$promise;
  }

  newTariff.$inject = ['TariffsService'];

  function newTariff(TariffsService) {
    return new TariffsService();
  }
}());
