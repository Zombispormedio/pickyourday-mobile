pydmCtrl.DashboardCtrl = function ($rootScope, $scope, $http, $ionicHistory) {
  	$scope.error="";
  	$scope.picks = "";

	$scope.getPicks = function(){
		$http.get("http://pickyourday.herokuapp.com/api/customer/pick/?afterInitDate=" + new Date()).then(function successCallback(response) {
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