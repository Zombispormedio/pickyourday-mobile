pydmCtrl.CompaniesDetailCtrl = function ($rootScope, $scope, $http, $stateParams) {

	var company = JSON.parse($stateParams.company);
	$scope.company = company;

	$scope.goServices = function () {
		$rootScope.go("app.companiesDetail.services", {company: JSON.stringify(company)} );
	}
}
