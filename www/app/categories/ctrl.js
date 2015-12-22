pydmCtrl.CategoriesCtrl = function ($rootScope, $scope, CustomerService) {

	$scope.categories = "";

	CustomerService.category().list({}, {} , function(result){
        var res = result;
        if (!res.error) {       
          	$scope.categories = res.data;		
        } else {
           $scope.error=res.error;
        }

    }, function(){

    });

}