'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:EventsCtrl
 * @description
 * # EventsCtrl
 * Controller of the appApp
 */
angular.module('appApp')
  .controller('EventsCtrl', function ($scope, $http, Event) {
    Event.query({'count': 10}, function (data) {
      $scope.events = data;
    });
  });
