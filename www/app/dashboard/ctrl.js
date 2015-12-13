pydmCtrl.DashboardCtrl = function ($rootScope, $scope, $http) {
  	$scope.error="";
  	$scope.picks = "";
  
	$http.get("http://pickyourday.herokuapp.com/api/customer/pick", $scope.user).then(function successCallback(response) {
		var res = response.data;
		if (!res.error) {
			var picksAux = response.data.data;
			$scope.picks = picksAux;							
		} else {
			$scope.error=res.error;
			//$scope.openModal(res.error);
		}

	}, function errorCallback(response) {

	}); 

	$scope.cleanError=function(){
		$scope.error="";
	}


}