(function () {
  'use strict';

  angular
    .module('activeRents.services')
    .factory('ActiveRentsService', ActiveRentsService);

  ActiveRentsService.$inject = ['$resource', '$log'];

  function ActiveRentsService($resource, $log) {
    var ActiveRent = $resource('/api/activeRents/:activeRentId', {
      activeRentId: '@_id'
    }, {
      update: {
        method: 'PUT'
      },
      cancel: {
        method: 'POST',
        isArray: false,
        hasBody: true
      }
    });

    angular.extend(ActiveRent.prototype, {
      createOrUpdate: function () {
        var activeRent = this;
        return createOrUpdate(activeRent);
      }
    });

    return ActiveRent;

    function createOrUpdate(activeRent) {
      if (activeRent._id) {
        return activeRent.$update(onSuccess, onError);
      } else {
        return activeRent.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(activeRent) {
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
