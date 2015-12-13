pydmCtrl.CompaniesDetailCtrl = function ($rootScope, $scope, $http, $stateParams) {

	var company = JSON.parse($stateParams.company);

	$scope.company = company;
	$scope.services = company.services;

	$scope.newPick = function (company, service) {
		$rootScope.go("app.newPick", {company: JSON.stringify(company), service: JSON.stringify(service)} );
	}
}
