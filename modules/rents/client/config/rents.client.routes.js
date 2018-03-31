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
      });
  }

  getRent.$inject = ['$stateParams', 'RentsService'];

  function getRent($stateParams, RentsService) {
    return RentsService.get({
      rentId: $stateParams.rentId
    }).$promise;
  }
}());
