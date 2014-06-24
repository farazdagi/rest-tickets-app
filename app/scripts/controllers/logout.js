'use strict';

/**
 * @ngdoc function
 * @name appApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the appApp
 */
angular.module('appApp')
  .controller('LogoutCtrl', function ($scope, $location, authSession) {
    authSession.destroy();
    $location.path('/login');
  });
