pydmCtrl.CategoriesCtrl = function ($rootScope, $scope, CustomerService) {

	$scope.categories = "";
  $scope.msg = "Cargando ...";

	CustomerService.category().list({}, {} , function(result){
      var res = result;
      if (!res.error) {       
        	$scope.categories = res.data;		
          if($scope.categories.length == 0)
            $scope.msg = "No se han encontrado resultados";
      } else {
         $scope.error=res.error;
         $scope.msg = "No se han encontrado resultados";
      }

  }, function(){

  });

  $scope.goSearch = function(idCat){
    console.log(idCat);
    $rootScope.go("app.search", {idCategory: idCat});
  }

}