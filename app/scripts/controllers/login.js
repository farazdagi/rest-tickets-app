'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the appApp
 */
angular.module('appApp')
  .controller('LoginCtrl', function ($scope, $location, authProvider, authSession) {
    $scope.message = '';
    $scope.user = { username: '', password: '' };

    // no need to re-authenticate
    if (authSession.isAuthenticated()) {
      $location.path('/');
    }

    $scope.login = function () {
      authProvider
        .authenticate($scope.user)
        .then(function (data) {
          $location.path('/');
        }, function (error) {
          $scope.message = error;
        });

    };
  });
