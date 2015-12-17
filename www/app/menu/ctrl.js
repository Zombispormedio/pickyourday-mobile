pydmCtrl.MenuCtrl = function ($rootScope, $scope, $ionicSideMenuDelegate, $http, $ionicModal, ngFB) {
	
	$scope.toggleLeftSideMenu = function(){
		$ionicSideMenuDelegate.toggleLeft();
	}

	$scope.logout = function () {

		console.log(getJSONLocal("userFB"));

		/*
		if(getJSONLocal("userFB")){
			ngFB.logout(function(){
	         	console.log("logout correcto");
	        },
	        function(fail){
	          console.log(fail);
	        });
		}
		*/

		$http.get("http://pickyourday.herokuapp.com/api/oauth/logout", $scope.user).then(function successCallback(response) {
			var res = response.data;
			if (!res.error) {
				deleteLocal("user");
				deleteLocal("userFB");
				$rootScope.go("login");
			} else {
				$scope.error=res.error;
				$scope.openModal();
			}

		}, function errorCallback(response) {

		});

	}

	$scope.goCompanies = function () {
		$rootScope.go("app.companies");
	}

	
	$scope.cleanError=function(){
			$scope.error="";
	}

}