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
          // Get edge points and adjust for correct timezone
          let timeZoneOffset = new Date().getTimezoneOffset();
          let chartStartDate = new Date(data.startDate);
          let chartEndDate = new Date(data.endDate);
          chartStartDate.setMinutes(chartStartDate.getMinutes() - timeZoneOffset);
          chartEndDate.setMinutes(chartEndDate.getMinutes() - timeZoneOffset);
          let chartStartDateUTC = convertDateToUTC(chartStartDate);
          let chartEndDateUTC = convertDateToUTC(chartEndDate);

          // Convert to format highcharts understands
          // Convert object of graph points to array
          let graphData = data.graphData;
          let chartData = [];
          for (var key in graphData) {
            if (graphData.hasOwnProperty(key)) {
              let date = new Date(key);
              date.setMinutes(date.getMinutes() - timeZoneOffset);
              // date.setMinutes(date.getMinutes() - timeZoneOffset);
              let dateUTC = convertDateToUTC(date);
              // console.log(date, graphData[key]);
              chartData.push([dateUTC, graphData[key]]);
            }
          }
          chartData.sort();
          // Set unused points to 0, add data where present
          let startJ = 0; // Prevent iterating through processed points
          graphData = [];
          let dateCounter = convertDateToUTC(chartStartDate);
          let hrsInWeek = 168;
          for (let i = 0; i < hrsInWeek; i++) {
            let sum = 0;
            for (let j = startJ; j < chartData.length; j++) {
              if (dateCounter === chartData[j][0]) {
                sum += chartData[j][1];
                startJ++;
              }
            }
            graphData.push([dateCounter, sum]);
            dateCounter += (60 * 60 * 1000);
          }
          // Create the chart
          var rentsLast3HrsChart = Highcharts.chart('container', {
            chart: {
              type: 'column'
            },
            title: {
              text: 'Rents past week'
            },
            xAxis: {
              type: 'datetime',
              title: {
                text: 'time'
              }
            },
            yAxis: {
              title: {
                text: 'rented % of time'
              },
              max: 100,
              min: 0
            },
            tooltip: {
              pointFormat: 'Rented: {point.y:.2f} %'
            },
            // rangeSelector: {
            //   verticalAlign: 'top',
            //   x: 0,
            //   y: 0
            // },
            series: [{
              type: 'column',
              name: '% time rented',
              data: graphData,
              // pointStart: chartStartDateUTC,
              // pointEnd: chartEndDateUTC,
              pointInterval: 60 * 60 * 1000, // Every hour
              pointPadding: 0,
              groupPadding: 0
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
