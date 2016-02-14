pydmCtrl.CompaniesDetailCtrl = function ($rootScope, $scope, $http, $stateParams, CustomerService) {


  var idCompany = $stateParams.idCompany;
  console.log(idCompany);

  $scope.company = [];
  $scope.services = [];
  $scope.reviews = [];

  CustomerService.company().getByID({"id": idCompany}, {}, function(result){
        var res = result;
        if (!res.error) {       
            $scope.company = res.data;    
            $scope.services = res.data.services;
            $scope.reviews = res.data.review;
        } else {
           $scope.error=res.error;
        }

    }, function(){

    });

    $scope.newPick = function (company, service) {
      $rootScope.go("app.newPick", {company: JSON.stringify(company), service: JSON.stringify(service)} );
    }


}
