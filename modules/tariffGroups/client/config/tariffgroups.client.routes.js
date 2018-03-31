(function () {
  'use strict';

  angular
    .module('tariffGroups.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('tariffGroups', {
        abstract: true,
        url: '/tariffGroups',
        template: '<ui-view/>'
      })
      .state('tariffGroups.list', {
        url: '',
        templateUrl: '/modules/tariffGroups/client/views/list-tariffGroups.client.view.html',
        controller: 'TariffGroupsListController',
        controllerAs: 'vm'
      })
      .state('tariffGroups.view', {
        url: '/:tariffGroupId',
        templateUrl: '/modules/tariffGroups/client/views/view-tariffGroup.client.view.html',
        controller: 'TariffGroupsController',
        controllerAs: 'vm',
        resolve: {
          tariffGroupResolve: getTariffGroup
        },
        data: {
          pageTitle: '{{ tariffGroupResolve.title }}'
        }
      });
  }

  getTariffGroup.$inject = ['$stateParams', 'TariffGroupsService'];

  function getTariffGroup($stateParams, TariffGroupsService) {
    return TariffGroupsService.get({
      tariffGroupId: $stateParams.tariffGroupId
    }).$promise;
  }
}());
