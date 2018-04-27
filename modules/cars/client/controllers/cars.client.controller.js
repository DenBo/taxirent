(function () {
  'use strict';

  angular
    .module('cars')
    .controller('CarsController', CarsController);

  CarsController.$inject = ['$scope', 'carResolve', 'rentsResolve', 'Authentication'];

  function CarsController($scope, car, rents, Authentication) {
    var vm = this;

    vm.car = car;
    vm.rents = rents;
    vm.authentication = Authentication;
    vm.getTotalProfit = getTotalProfit;

    displayChart();

    function getTotalProfit() {
      var sum = 0;
      for (var i = 0; i < vm.rents.length; i++) {
        sum += vm.rents[i].profit;
      }
      return sum / 100;
    }

    function displayChart() {
      // Create the chart
      var rentsChart = Highcharts.chart('container', {
        chart: {
          type: 'area'
        },
        title: {
          text: 'Rents'
        },
        xAxis: {
          type: 'datetime',
          dateTimeLabelFormats: { // don't display the dummy year
            month: '%e. %b',
            year: '%b'
          },
          title: {
            text: 'Date'
          }
        },
        yAxis: {
          title: {
            text: 'number of rents'
          }
        },
        series: [{
          name: 'rents',
          data: [1, 0, 4]
        }]
      });
    }
  }
}());
