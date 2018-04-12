(function () {
  'use strict';

  angular
    .module('cars.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('cars', {
        abstract: true,
        url: '',
        template: '<ui-view/>'
      })
      .state('cars.list', {
        url: '',
        templateUrl: '/modules/cars/client/views/list-cars.client.view.html',
        controller: 'CarsListController',
        controllerAs: 'vm'
      })
      .state('cars.view', {
        url: '/:carId',
        templateUrl: '/modules/cars/client/views/view-car.client.view.html',
        controller: 'CarsController',
        controllerAs: 'vm',
        resolve: {
          carResolve: getCar,
          rentsResolve: getRents
        },
        data: {
          pageTitle: '{{ carResolve.name }}'
        }
      });
  }

  getCar.$inject = ['$stateParams', 'CarsService'];

  function getCar($stateParams, CarsService) {
    return CarsService.get({
      carId: $stateParams.carId
    }).$promise;
  }

  getRents.$inject = ['$stateParams', 'RentsService'];

  function getRents($stateParams, RentsService) {
    return RentsService.getByCarId({}, {
      carId: $stateParams.carId
    }).$promise;
  }
}());
