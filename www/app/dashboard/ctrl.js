pydmCtrl.DashboardCtrl = function ($rootScope, $scope, $http) {
  	$scope.error="";
  	$scope.picks = "";
  
	$scope.getPicks = function(){
		$http.get("http://pickyourday.herokuapp.com/api/customer/pick", $scope.user).then(function successCallback(response) {
			var res = response.data;
			if (!res.error) {
				var picksAux = response.data.data;
				$scope.picks = picksAux;			
				$scope.$broadcast('scroll.refreshComplete');				
			} else {
				$scope.error=res.error;
				$scope.$broadcast('scroll.refreshComplete');
				//$scope.openModal(res.error);
			}

		}, function errorCallback(response) {

		}); 
	}

	

	$scope.doRefresh = function() {
		$scope.getPicks();
	}

	$scope.$on('$ionicView.enter', function() {
    	$scope.getPicks();
	});

	$scope.cleanError=function(){
		$scope.error="";
	}


}