// Ionic Starter App

var adminCtrl = {};
var adminFtry = {};
var adminFiltr = {};
var adminDrctv = {};

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])
  .controller(adminCtrl)
  .factory(adminFtry)
  .filter(adminFiltr)
  .directive(adminDrctv)

  .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {


  $stateProvider
      .state("login", {
        url: "/login",
        onEnter: function ($rootScope) {
          if (getJSONLocal("user")) {            
            $rootScope.go("app");
          }
        },
        templateUrl: 'app/login/main.html',
        controller: 'LoginCtrl'

      })

    $urlRouterProvider.otherwise("/login");
    $httpProvider.interceptors.push('AuthInterceptor');

  })




.run(function($ionicPlatform) {
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


