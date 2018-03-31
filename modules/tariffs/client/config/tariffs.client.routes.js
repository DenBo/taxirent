(function () {
  'use strict';

  angular
    .module('tariffs.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('tariffs', {
        abstract: true,
        url: '/tariffs',
        template: '<ui-view/>'
      })
      .state('tariffs.list', {
        url: '',
        templateUrl: '/modules/tariffs/client/views/list-tariffs.client.view.html',
        controller: 'TariffsListController',
        controllerAs: 'vm'
      })
      .state('tariffs.view', {
        url: '/:tariffId',
        templateUrl: '/modules/tariffs/client/views/view-tariff.client.view.html',
        controller: 'TariffsController',
        controllerAs: 'vm',
        resolve: {
          tariffResolve: getTariff
        },
        data: {
          pageTitle: '{{ tariffResolve.title }}'
        }
      });
  }

  getTariff.$inject = ['$stateParams', 'TariffsService'];

  function getTariff($stateParams, TariffsService) {
    return TariffsService.get({
      tariffId: $stateParams.tariffId
    }).$promise;
  }
}());
