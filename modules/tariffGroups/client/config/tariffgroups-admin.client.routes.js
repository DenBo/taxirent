(function () {
  'use strict';

  angular
    .module('tariffGroups.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.tariffGroups', {
        abstract: true,
        url: '/tariffGroups',
        template: '<ui-view/>'
      })
      .state('admin.tariffGroups.list', {
        url: '',
        templateUrl: '/modules/tariffGroups/client/views/admin/list-tariffGroups.client.view.html',
        controller: 'TariffGroupsAdminListController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        }
      })
      .state('admin.tariffGroups.create', {
        url: '/create',
        templateUrl: '/modules/tariffGroups/client/views/admin/form-tariffGroup.client.view.html',
        controller: 'TariffGroupsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin']
        },
        resolve: {
          tariffGroupResolve: newTariffGroup
        }
      })
      .state('admin.tariffGroups.edit', {
        url: '/:tariffGroupId/edit',
        templateUrl: '/modules/tariffGroups/client/views/admin/form-tariffGroup.client.view.html',
        controller: 'TariffGroupsAdminController',
        controllerAs: 'vm',
        data: {
          roles: ['admin'],
          pageTitle: '{{ tariffGroupResolve.title }}'
        },
        resolve: {
          tariffGroupResolve: getTariffGroup
        }
      });
  }

  getTariffGroup.$inject = ['$stateParams', 'TariffGroupsService'];

  function getTariffGroup($stateParams, TariffGroupsService) {
    return TariffGroupsService.get({
      tariffGroupId: $stateParams.tariffGroupId
    }).$promise;
  }

  newTariffGroup.$inject = ['TariffGroupsService'];

  function newTariffGroup(TariffGroupsService) {
    return new TariffGroupsService();
  }
}());
