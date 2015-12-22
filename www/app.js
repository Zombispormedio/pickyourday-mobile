// Ionic Starter App

var pydmCtrl = {};
var pydmFtry = {};
var pydmFiltr = {};
var pydmDrctv = {};

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app=angular.module('starter', ['ionic', 'ionic-datepicker', 'ngOpenFB', "ngResource", 'ui.bootstrap.datetimepicker'])
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
          'tab-dashboard': {
            templateUrl: 'app/dashboard/main.html',
            controller: 'DashboardCtrl'
          }
        }
      })


      .state("app.categories", {
        url: "/categories",
        onEnter: function ($rootScope) {
          if (!getJSONLocal("user")) {            
            $rootScope.go("login");
          }
        },
        views: {
          'tab-categories': {
            templateUrl: 'app/categories/main.html',
            controller: 'CategoriesCtrl'
          }
        }
      })

      .state("app.prepicks", {
        url: "/prepicks",
        onEnter: function ($rootScope) {
          if (!getJSONLocal("user")) {            
            $rootScope.go("login");
          }
        },
        views: {
          'tab-prepicks': {
            templateUrl: 'app/prepicks/main.html',
            controller: 'PrepicksCtrl'
          }
        }
      })

      .state("app.companies", {
        url: "/companies",
        onEnter: function ($rootScope) {
          if (!getJSONLocal("user")) {            
            $rootScope.go("login");
          }
        },
        views: {
          'companies': {
            templateUrl: 'app/companies/main.html',
            controller: 'CompaniesCtrl'
          }
        }
      })

      .state("app.companiesDetail", {
        url: "/companies/detail/:company",
        onEnter: function ($rootScope) {
          if (!getJSONLocal("user")) {            
            $rootScope.go("login");
          }
        },
        views: {
          'companies': {
            templateUrl: 'app/companies/detail/main.html',
            controller: 'CompaniesDetailCtrl'
          }
        }
      })


      .state("app.newPick", {
        url: "/newPick/:company/service/:service",
        onEnter: function ($rootScope) {
          if (!getJSONLocal("user")) {            
            $rootScope.go("login");
          }
        },
        views: {
          'newPick': {
            templateUrl: 'app/newPick/main.html',
            controller: 'NewPickCtrl'
          }
        }
      })

      .state("app.profile", {
        url: "/profile",
        onEnter: function ($rootScope) {
          if (!getJSONLocal("user")) {            
            $rootScope.go("login");
          }
        },
        views: {
          'profile': {
            templateUrl: 'app/profile/main.html',
            controller: 'ProfileCtrl'
          }
        }
      })


    $urlRouterProvider.otherwise("/login");
    $httpProvider.interceptors.push('AuthInterceptor');

  })




.run(function($ionicPlatform, $rootScope, $state, $ionicModal, ngFB) {
  ngFB.init({appId: '122387958132479'});

  $rootScope.go = function(state, params){
    $state.go(state, params);
  }

    $ionicModal.fromTemplateUrl('app/modal/modal.html', {
    scope: $rootScope,
    animation: 'fade-in-scale'
    }).then(function(modal) {
      $rootScope.modal = modal;
    });

    $rootScope.openModal = function(err) {
      $rootScope.error = err;
      $rootScope.modal.show();
    };
    $rootScope.closeModal = function() {
      $rootScope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $rootScope.$on('$destroy', function() {
      $rootScope.modal.remove();
    });
    // Execute action on hide modal
    $rootScope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $rootScope.$on('modal.removed', function() {
      // Execute action
    });

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


