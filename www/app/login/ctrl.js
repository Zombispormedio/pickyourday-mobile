pydmCtrl.LoginCtrl = function ($rootScope, $scope, $http, $ionicModal, ngFB) {
	$scope.error="";
	$scope.exists = "";
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
					$scope.openModal(res.error);
				}

			}, function errorCallback(response) {

			});
		}

	}

	function existsUser(id, email){
		if (email !== "") {
			$http.get("http://pickyourday.herokuapp.com/api/oauth/check/?email=" + email).then(function successCallback(response) {
				var res = response.data;
				console.log("hh: " + res.data);
				$scope.exists = res.data;
				$scope.register(id, email);

			}, function errorCallback(response) {
				$scope.openModal(response);
			});
		}
	}

	$scope.register = function (id, email){
		if (email !== "" && id !== "") {
			var obj = {
				"email" : email,
				"password" : id
			}
			if($scope.exists == true){
				$scope.user.email = email;
				$scope.user.password = id;
				$scope.login();
			}else{
				$http.post("http://pickyourday.herokuapp.com/api/customer", obj).then(function successCallback(response) {
				var res = response.data;
				if (!res.error) {
					$scope.user.email = email;
					$scope.user.password = id;
					$scope.login();
				} else {
					$scope.error= res.error;
					$scope.openModal(res.error.errmsg);
				}

				}, function errorCallback(response) {

				});
				
			}
		}
	}

	$scope.registerWithFb = function (){
		ngFB.api({
	        path: '/me',
	        params: {fields: 'id, email'}
	    }).then(
	    function (user) {
	        $scope.user = user;
	        //$scope.register(user.id, user.email);
	        existsUser(user.id, user.email);
	 		console.log(user);
	    },
	    function (error) {
	    	$scope.error=  error.error_description;
			$scope.openModal(error.error_description);
	    });
	}

	$scope.fbLogin = function () {
	    ngFB.login({scope: 'email'}).then(
	        function (response) {
	            if (response.status === 'connected') {
	                console.log('Facebook login succeeded');
	                console.log(response);
	                console.log(response.authResponse.accessToken);
	                $scope.registerWithFb();
	                //saveLocal("user", response.authResponse.accessToken);
	            } else {
	                alert('Facebook login failed');
	            }
	        });
	};

	$scope.cleanError=function(){
			$scope.error="";
	}

}