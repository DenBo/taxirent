(function () {
  'use strict';

  angular
    .module('cars.services')
    .factory('CarsService', CarsService);

  CarsService.$inject = ['$resource', '$log'];

  function CarsService($resource, $log) {
    var Car = $resource('/api/cars/:carId', {
      carId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(Car.prototype, {
      createOrUpdate: function () {
        var car = this;
        return createOrUpdate(car);
      }
    });

    return Car;

    function createOrUpdate(car) {
      if (car._id) {
        return car.$update(onSuccess, onError);
      } else {
        return car.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(car) {
        // Any required internal processing from inside the service, goes here.
      }

      // Handle error response
      function onError(errorResponse) {
        var error = errorResponse.data;
        // Handle error internally
        handleError(error);
      }
    }

    function handleError(error) {
      // Log error
      $log.error(error);
    }
  }
}());
