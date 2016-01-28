pydmCtrl.SearchCtrl = function ($rootScope, $scope, $http, ngFB, CustomerService, $ionicScrollDelegate) {

  	$scope.error="";

  	$scope.companies = "";

	

	CustomerService.company().list({}, {}, function(result){
        var res = result;
        if (!res.error) {       
          	$scope.companies = res.data;		
        } else {
           $scope.error=res.error;
        }

    }, function(){

    });


	$scope.scrollTop = function() {
		$ionicScrollDelegate.scrollTop();
	};


	$scope.goDetail = function (company) {
		$rootScope.go("app.companiesDetail", {company: JSON.stringify(company)} );
	}

}