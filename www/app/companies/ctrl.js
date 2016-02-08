pydmCtrl.CompaniesCtrl = function ($rootScope, $scope, $http, $stateParams, CustomerService) {

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


	$scope.goDetail = function (company) {
    console.log(company);
		$rootScope.go("app.companiesDetail.info", {company: JSON.stringify(company)} );

	}


}