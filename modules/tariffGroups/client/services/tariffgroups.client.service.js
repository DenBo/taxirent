(function () {
  'use strict';

  angular
    .module('tariffGroups.services')
    .factory('TariffGroupsService', TariffGroupsService);

  TariffGroupsService.$inject = ['$resource', '$log'];

  function TariffGroupsService($resource, $log) {
    var TariffGroup = $resource('/api/tariffGroups/:tariffGroupId', {
      tariffGroupId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });

    angular.extend(TariffGroup.prototype, {
      createOrUpdate: function () {
        var tariffGroup = this;
        return createOrUpdate(tariffGroup);
      }
    });

    return TariffGroup;

    function createOrUpdate(tariffGroup) {
      if (tariffGroup._id) {
        return tariffGroup.$update(onSuccess, onError);
      } else {
        return tariffGroup.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(tariffGroup) {
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
