pydmCtrl.MenuCtrl = function ($rootScope, $scope, $ionicSideMenuDelegate, $http, $ionicModal) {
	
	$scope.toggleLeftSideMenu = function(){
		$ionicSideMenuDelegate.toggleLeft();
	}

	$scope.logout = function () {

		$http.get("http://pickyourday.herokuapp.com/api/oauth/logout", $scope.user).then(function successCallback(response) {
			var res = response.data;
			if (!res.error) {
				deleteLocal("user");
				$rootScope.go("login");
			} else {
				$scope.error=res.error;
				$scope.openModal();
			}

		}, function errorCallback(response) {

		});

	}

	
	$scope.cleanError=function(){
			$scope.error="";
	}

}