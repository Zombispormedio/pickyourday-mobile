pydmCtrl.CompaniesCtrl = function ($rootScope, $scope, $http, $stateParams) {

	$scope.companies = "";

	$http.get("http://pickyourday.herokuapp.com/api/customer/searchcompany", $scope.user).then(function successCallback(response) {
		var res = response.data;
		if (!res.error) {
			$scope.companies = response.data.data;							
		} else {
			$scope.error=res.error;
		}

	}, function errorCallback(response) {

	}); 

	$scope.goDetail = function (company) {

		$rootScope.go("app.companiesDetail", {company: JSON.stringify(company)} );
	}


}