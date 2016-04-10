pydmCtrl.CompaniesCtrl = function ($rootScope, $scope, $http, $stateParams, CustomerService) {

	$scope.companies = "";

	CustomerService.company().list({}, {}, function(result){
        var res = result;
        console.log(res);
        if (!res.error) {       
          	$scope.companies = res.data;		
        } else {
          console.log(res.error);
           $scope.error=res.error;
        }

    }, function(){

    });


  $scope.goDetail = function (idCompany) {
    $rootScope.go("app.companyDetail", {idCompany: idCompany });
  }


}