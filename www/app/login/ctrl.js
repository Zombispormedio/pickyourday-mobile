pydmCtrl.LoginCtrl = function ($rootScope, $scope, $http, $ionicModal) {
	$scope.error="";
	$scope.user = {};
	$scope.login = function () {
		if ($scope.user.email !== "" && $scope.user.password !== "") {
			$http.post("http://pickyourday.herokuapp.com/api/oauth", $scope.user).then(function successCallback(response) {
				var res = response.data;
				if (!res.error) {
					saveLocal("user", response.data.data);
					$rootScope.go("app.dashboard");
				} else {
					$scope.error=res.error;
					$scope.openModal();
				}

			}, function errorCallback(response) {

			});
		}

	}

	$scope.cleanError=function(){
			$scope.error="";
	}

}