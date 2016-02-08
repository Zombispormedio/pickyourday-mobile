pydmCtrl.CompaniesReviewsCtrl = function ($rootScope, $scope, $http, $stateParams) {

	var company = JSON.parse($stateParams.company);

	$scope.company = company;

}
