(function () {
  'use strict';

  angular
    .module('tariffs.services')
    .factory('TariffsService', TariffsService);

  TariffsService.$inject = ['$resource', '$log'];

  function TariffsService($resource, $log) {
    var Tariff = $resource('/api/tariffs/:tariffId', {
      tariffId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      subset: {
        method: 'POST',
        params: {
          tariffId: 'subset'
        },
        isArray: true,
        hasBody: true,
        requestType: 'json',
        responseType: 'json'
      }
    });

    angular.extend(Tariff.prototype, {
      createOrUpdate: function () {
        var tariff = this;
        return createOrUpdate(tariff);
      }
    });

    return Tariff;

    function createOrUpdate(tariff) {
      if (tariff._id) {
        return tariff.$update(onSuccess, onError);
      } else {
        return tariff.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(tariff) {
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
