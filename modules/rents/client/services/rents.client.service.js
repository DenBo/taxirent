(function () {
  'use strict';

  angular
    .module('rents.services')
    .factory('RentsService', RentsService);

  RentsService.$inject = ['$resource', '$log'];

  function RentsService($resource, $log) {

    var Rent =
      {
        Basic: $resource(
          '/api/rents/:rentId',
          {
            rentId: '@_id'
          },
          {
            update: {
              method: 'PUT'
            },
            getByCarId:
            {
              method: 'POST',
              params: {
                rentId: 'bycar'
              },
              isArray: true,
              hasBody: true,
              requestType: 'json',
              responseType: 'json'
            }
          }
        ),
        CarUsageStats: $resource(
          '/api/rents/car_usage'
        )
      };

    angular.extend(Rent.Basic.prototype, {
      createOrUpdate: function () {
        var rent = this;
        return createOrUpdate(rent);
      }
    });

    return Rent;

    function createOrUpdate(rent) {
      if (rent._id) {
        return rent.$update(onSuccess, onError);
      } else {
        return rent.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(rent) {
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
