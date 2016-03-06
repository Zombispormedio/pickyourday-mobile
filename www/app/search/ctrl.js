pydmCtrl.SearchCtrl = function ($rootScope, $scope, $http, ngFB, CustomerService, $ionicScrollDelegate, $ionicModal) {

	$scope.error="";

	$scope.companies = [];
  $scope.services = [];
  $scope.prepicks = [];

  $scope.searchText = "";

  $scope.search = function(){

    var category = "";
    if($scope.data.selCategory)
      category = $scope.data.selCategory._id;

      console.log($scope.city + " - " +  $scope.country);
      CustomerService.search().list({"name": $scope.searchText, "category": category, "location.city": $scope.city, "location.country": $scope.country}, {}, function(result){
          var res = result;
          if (!res.error) {       
              console.log(res);
              $scope.companies = res.data.companies;    
              $scope.services = res.data.services;
              $scope.prepicks = res.data.prepicks;
          } else {
             $scope.error=res.error;
             console.log(res.error);
          }
      }, function(){

      });
  };

  //Infinite scroll
  $scope.loadMore = function() {
    //llamada a la api
      $scope.$broadcast('scroll.infiniteScrollComplete');
  };

  $scope.$on('$stateChangeSuccess', function() {
    $scope.loadMore();
  });

  //Search preferences
  $ionicModal.fromTemplateUrl('app/search/config/main.html', {
      scope: $scope,
      animation: 'slide-in-right'
  }).then(function(modal) {
      $scope.modal = modal;
  });

  $scope.openModal = function() {
      $scope.modal.show();
  };

  $scope.closeModal = function() {
      $scope.search();
      $scope.modal.hide();
  };

  //Categories
  $ionicModal.fromTemplateUrl('app/search/categories/main.html', {
      scope: $scope,
      animation: 'scale-in'
  }).then(function(modal) {
      $scope.categories_popup = modal;
  });

  $scope.openCategories = function() {
      $scope.categories_popup.show();
  };

  $scope.closeCategories = function() {
      $scope.search();
      $scope.categories_popup.hide();
  };

  $scope.categories = "";
  $scope.data = {
    selCategory: ''
  };

  $scope.getCategories = function(){
    CustomerService.category().list({}, {} , function(result){
          var res = result;
          if (!res.error) {       
              $scope.categories = res.data;   
          } else {
             $scope.error=res.error;
          }

      }, function(){

      });
  };

  $scope.getCategories();

  //Location
  $scope.city = "";
  $scope.country = "";

  $ionicModal.fromTemplateUrl('app/search/location/main.html', {
      scope: $scope,
      animation: 'scale-in'
  }).then(function(modal) {
      $scope.location_popup = modal;
  });

  $scope.openLocation = function() {
      $scope.location_popup.show();
  };

  $scope.closeLocation = function() {
      $scope.search();
      $scope.location_popup.hide();
  };

  $scope.locationChanged = function (location) {
    var aux = location.split(",");
    var i1 = aux.length - 1;
    var i2 = aux.length - 2;
    var country = "";
    var city = "";

    if(aux[i1] )
      $scope.country = aux[i1];
    else
      $scope.country = "";

    if( aux[i2])
      $scope.city = aux[i2];
    else
      $scope.city = "";
  };

  $scope.clearCity = function(){
    $scope.city = "";
  }

  $scope.clearCountry = function(){
    $scope.country = "";
  }

  //Search input
  $scope.$watch('searchText', function (val) {
    if(val){
      $scope.searchText = val;
      $scope.search();
    }else{
      val = "";
      $scope.search();
    }
  })

	$scope.scrollTop = function() {
		$ionicScrollDelegate.scrollTop();
	};


  //Navigation
	$scope.goDetail = function (idCompany) {
    $rootScope.go("app.companyDetail", {idCompany: idCompany });
  }

  $scope.cleanError=function(){
      $scope.error="";
  }
  
  

}