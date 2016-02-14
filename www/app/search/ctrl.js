pydmCtrl.SearchCtrl = function ($rootScope, $scope, $http, ngFB, CustomerService, $ionicScrollDelegate) {

	$scope.error="";

	$scope.companies = "";


  $scope.getCompanies = function(){
  	CustomerService.company().list({}, {}, function(result){
          var res = result;
          if (!res.error) {       
            	$scope.companies = res.data;		
              $scope.services = res.data.services;
              $scope.$broadcast('scroll.refreshComplete');  
          } else {
             $scope.error=res.error;
             $scope.$broadcast('scroll.refreshComplete'); 
          }

      }, function(){

      });
  };
  
  $scope.getCompanies();

	$scope.scrollTop = function() {
		$ionicScrollDelegate.scrollTop();
	};


	$scope.goDetail = function (idCompany) {
    $rootScope.go("app.companyDetail", {idCompany: idCompany });
  }


  $scope.doRefresh = function() {
    $scope.getCompanies();
  }
  $scope.cleanError=function(){
      $scope.error="";
  }

  $scope.$on('$ionicView.enter', function() {
      $scope.getCompanies();
  });

}