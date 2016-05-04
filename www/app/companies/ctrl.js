pydmCtrl.CompaniesCtrl = function ($rootScope, $scope, $http, $stateParams, CustomerService) {

	$scope.companies = "";
  $scope.msg = "Cargando ...";

	CustomerService.company().list({}, {}, function(result){
        var res = result;
        console.log(res);
        if (!res.error) {       
          	$scope.companies = res.data;		
            console.log(res.data);
            if(res.data.length == 0)
              $scope.msg = "¡Ups! No hay compañías.";
        } else {
          console.log(res.error);
          $scope.msg = "¡Ups! No hay compañías.";
          $scope.error=res.error;
        }

    }, function(){

    });


  $scope.goDetail = function (idCompany) {
    $rootScope.go("app.companyDetail", {idCompany: idCompany });
  }


}