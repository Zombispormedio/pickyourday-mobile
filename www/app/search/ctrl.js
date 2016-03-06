pydmCtrl.SearchCtrl = function ($rootScope, $scope, $http, ngFB, CustomerService, $ionicScrollDelegate, $ionicModal) {

	$scope.error="";

	$scope.companies = [];
  $scope.services = [];
  $scope.prepicks = [];

  $scope.search = function(val){
    console.log(val);
      CustomerService.search().list({"name": val}, {}, function(result){
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
      $scope.modal.hide();
  };

  //Search input
  $scope.$watch('searchText', function (val) {
    if(val)
      $scope.search(val);
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