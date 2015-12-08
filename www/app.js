// Ionic Starter App

var pydmCtrl = {};
var pydmFtry = {};
var pydmFiltr = {};
var pydmDrctv = {};

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])
  .controller(pydmCtrl)
  .factory(pydmFtry)
  .filter(pydmFiltr)
  .directive(pydmDrctv)

  .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {


  $stateProvider
      .state("login", {
        url: "/login",
        onEnter: function ($rootScope) {
          if (getJSONLocal("user")) {            
            $rootScope.go("app.dashboard");
          }
        },
        templateUrl: 'app/login/main.html',
        controller: 'LoginCtrl'

      })

      .state("app", {
        url: "",
        onEnter: function ($rootScope) {
          if (!getJSONLocal("user")) {            
            $rootScope.go("login");
          }
        },
        abstract: true,
        templateUrl: 'app/menu/main.html',
        controller: 'MenuCtrl'

      })

      .state("app.dashboard", {
        url: "/dashboard",
        onEnter: function ($rootScope) {
          if (!getJSONLocal("user")) {            
            $rootScope.go("login");
          }
        },
        views: {
          'content': {
            templateUrl: 'app/dashboard/main.html',
            controller: 'DashboardCtrl'
          }
        }
      })

    $urlRouterProvider.otherwise("/login");
    $httpProvider.interceptors.push('AuthInterceptor');

  })




.run(function($ionicPlatform, $rootScope, $state) {

  $rootScope.go = function(state, params){
    $state.go(state, params);
  }

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})


