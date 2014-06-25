'use strict';

/**
 * @ngdoc overview
 * @name appApp
 * @description
 * # appApp
 *
 * Main module of the application.
 */
angular
  .module('appApp', [
    'ngResource',
    'ngRoute'
  ])
  .factory('authInterceptor', function ($rootScope, $q, $window, $location) {
    return {
      request: function (config) {
        config.headers = config.headers || {};
        if($window.sessionStorage.token) {
          config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
        }
        return config;
      },
      responseError: function (response) {
        if(response.status === 401) {
          $location.path('/login');
        }
        return $q.reject(response);
      }
    };
  })
  .factory('authProvider', function ($rootScope, $http, $window, $q, authSession) {
    return {
      authenticate: function (user) {
        var response = $q.defer();

        $http
          .post('https://api.rest.tickets/authenticate', user)
          .success(function (data, status, headers, config) {
            authSession.create(data.access_token);

            $rootScope.$emit('authProvider:login-success');
            response.resolve(user);
          })
          .error(function (data, status, headers, config) {
            authSession.destroy();
            response.reject(data.message);
          });

        return response.promise;
      }
    };
  })
  .factory('authSession', function ($window) {
    return {
      create: function (access_token) {
        $window.sessionStorage.token = access_token;

        // extract payload
        var payload = angular.fromJson($window.atob(access_token.split('.')[1]));
        $window.sessionStorage.username = payload.username;
      },
      destroy: function () {
        // clear token and username
        delete $window.sessionStorage.token;
        delete $window.sessionStorage.username;
      },
      getToken: function () {
        if (angular.isDefined($window.sessionStorage.token)) {
          return $window.sessionStorage.token;
        }
        return null;
      },
      getUsername: function () {
        if (angular.isDefined($window.sessionStorage.username)) {
          return $window.sessionStorage.username;
        }
        return null;
      },
      isAuthenticated: function () {
        return this.getUsername();
      }
    };
  })
  .factory('Event', function ($resource) {
    return $resource('https://api.rest.tickets/secured/events/:id');
  })
  .config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/events', {
        templateUrl: 'views/events.html',
        controller: 'EventsCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/logout', {
        templateUrl: 'views/login.html',
        controller: 'LogoutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

