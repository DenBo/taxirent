(function () {
  'use strict';

  angular
    .module('cars')
    .controller('CarsController', CarsController);

  CarsController.$inject = ['$scope', 'carResolve', 'rentsResolve', 'RentsService', 'Authentication', 'Notification'];

  function CarsController($scope, car, rents, RentsService, Authentication, Notification) {
    var vm = this;

    vm.car = car;
    vm.rents = rents;
    vm.authentication = Authentication;
    vm.getTotalProfit = getTotalProfit;
    vm.displayChart = displayChart;

    displayChart();

    function getTotalProfit() {
      var sum = 0;
      for (var i = 0; i < vm.rents.length; i++) {
        sum += vm.rents[i].profit;
      }
      return sum / 100;
    }

    function displayChart() {
      RentsService.RentsGraphCar.get({ carId: vm.car._id }).$promise.then(
        function (data) {
          let graphData = data.graphData;
          // console.log(data);
          let chartData = [];
          for (var key in graphData) {
            if (graphData.hasOwnProperty(key)) {
              let date = new Date(key);
              // date.setMinutes(date.getMinutes() - timeZoneOffset);
              let dateUTC = convertDateToUTC(date);
              // console.log(date, graphData[key]);
              chartData.push([dateUTC, graphData[key]]);
            }
          }
          chartData.sort();
          // Create the chart
          var rentsLast3HrsChart = Highcharts.chart('container', {
            chart: {
              type: 'area'
            },
            title: {
              text: 'Rents'
            },
            xAxis: {
              type: 'datetime',
              title: {
                text: 'time'
              }
            },
            yAxis: {
              title: {
                text: 'number of rents'
              }
            },
            series: [{
              name: 'rents',
              data: chartData
            }]
          });
        },
        function (err) {
          Notification.error({ message: '<i class="glyphicon glyphicon-ok"></i> Error while getting graph data!' });
        }
      );
    }

    function convertDateToUTC(date) {
      return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    }
  }
}());
