'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the appApp
 */
angular.module('appApp')
  .controller('NavCtrl', function ($scope, $location, authSession) {
    $scope.activePath = null;
    $scope.isAuthenticated = false;

    $scope.$on('$routeChangeSuccess', function () {
      $scope.activePath = $location.path();
      $scope.isAuthenticated = authSession.isAuthenticated();
    });
  });
