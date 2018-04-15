(function () {
  'use strict';

  angular
    .module('globalVars.services')
    .factory('GlobalVarsService', GlobalVarsService);

  GlobalVarsService.$inject = ['$resource', '$log'];

  function GlobalVarsService($resource, $log) {
    var GlobalVar = {
      all: $resource('/api/globalVars/', {
        update: {
          method: 'PUT'
        }
      }),
      profit: $resource('/api/globalVars/profit')
    };

    angular.extend(GlobalVar.all.prototype, {
      createOrUpdate: function () {
        var globalVar = this;
        return createOrUpdate(globalVar);
      }
    });

    return GlobalVar;

    function createOrUpdate(globalVar) {
      if (globalVar._id) {
        return globalVar.$update(onSuccess, onError);
      } else {
        return globalVar.$save(onSuccess, onError);
      }

      // Handle successful response
      function onSuccess(globalVar) {
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
