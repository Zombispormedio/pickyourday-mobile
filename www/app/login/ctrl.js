pydmCtrl.LoginCtrl = function ($rootScope, $scope, $http, $ionicModal, ngFB, $ionicSlideBoxDelegate, OauthService, CustomerService, $ionicLoading) {
	$scope.error="";
	$scope.exists = "";
	$scope.user = {};
	$scope.userR = {};
	$scope.login = function (id, email) {

		if ( ($scope.user.email && $scope.user.password ) || (id && email ) ) {

			if(id && email){
				var obj = {
					"email" : email,
					"password" : id
				}
			}else{
				var obj = $scope.user;
			}

			OauthService.login().Session({}, obj , function(result){
	            var res = result;
	            if (!res.error) {       
	              	saveLocal("user", res.data);
	              	if(email && id)
						saveLocal("userFB", id);

					$rootScope.go("app.dashboard");
	            } else {
	               	$scope.error=res.error;
					$scope.openModal(res.error);
	            }

	        }, function(){

	        });
		}

	}

	function existsUser(id, email){
		if (email !== "") {

			OauthService.check().list({email: email}, {} , function(result){
	            var res = result;
	            $scope.exists = res.data;
				$scope.register(id, email);
	        }, function(){
				$scope.openModal("Server not found");
	        });
		}
	}

	$scope.register = function (id, email){
		if ( ($scope.userR.email  && $scope.userR.password && $scope.userR.password2 ) || (id && email) ) {

			if(id && email){
				var obj = {
					"email" : email,
					"password" : id
				}
			}else if($scope.userR.password != $scope.userR.password2 ){
				$scope.openModal("Las contraseñas no coinciden");
			}else{
				var obj = {
					"email" : $scope.userR.email,
					"password" : $scope.userR.password
				}
				$scope.user.email = $scope.userR.email;
				$scope.user.password = $scope.userR.password;
			}
			
			if($scope.exists == true){
				$scope.login(id, email);
			}else{


		
				CustomerService.register().create({}, obj , function(result){
		            var res = result;
		            if (!res.error) {
						$scope.openModal("Registro correcto");
						$scope.login(id, email);
					} else {
						$scope.error= res.error;
						$scope.openModal(res.error.errmsg);
					}
		        }, function(){
					$scope.openModal("Server not found");
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
	        existsUser(user.id, user.email);
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
	                $scope.registerWithFb();
	            } else {
	                alert('Facebook login failed');
	            }
	        });
	};

	$scope.googleSignIn = function() {

		window.plugins.googleplus.isAvailable(
		    function (available) {
		      if (available) {
		      	$scope.openModal("eh");
		      }
		    }
		);
		/*
	    $ionicLoading.show({
	      template: 'Logging in...'
	    });

	    window.plugins.googleplus.login(
	      {},
	      function (user_data) {
	       
	      	console.log(user_data);
	        $ionicLoading.hide();
	        
	      },
	      function (msg) {
	        $ionicLoading.hide();
	      }
	    );
*/
	};

	$scope.cleanError=function(){
			$scope.error="";
	}


	$scope.nextSlide = function() {
    	$ionicSlideBoxDelegate.next();
  	}

  	$scope.previousSlide = function() {
  		$ionicSlideBoxDelegate.previous();
  	}

}