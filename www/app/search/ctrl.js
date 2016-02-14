pydmCtrl.SearchCtrl = function ($rootScope, $scope, $http, ngFB, CustomerService, $ionicScrollDelegate) {

  	$scope.error="";

  	$scope.companies = "";

	

	CustomerService.company().list({}, {}, function(result){
        var res = result;
        if (!res.error) {       
          	$scope.companies = res.data;		
            $scope.services = res.data.services;
        } else {
           $scope.error=res.error;
        }

    }, function(){

    });


	$scope.scrollTop = function() {
		$ionicScrollDelegate.scrollTop();
	};


	$scope.goDetail = function (idCompany) {
    
    $rootScope.go("app.companyDetail", {idCompany: idCompany });
  }

}