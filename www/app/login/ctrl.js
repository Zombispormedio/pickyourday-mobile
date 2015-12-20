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

	var requestToken = "";
	var accessToken = "";
	var clientId = "492674088302-eg1tjtks9t05qen8u753fjvbde4ndb1e.apps.googleusercontent.com";
	var clientSecret = "1KpoioqUOY-dRG_XTKbDa1iV";
	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
 
    $scope.googleSignIn = function() {
        var ref = window.open('https://accounts.google.com/o/oauth2/auth?client_id=' + clientId + '&redirect_uri=http://localhost/callback&scope=https://www.googleapis.com/auth/urlshortener&approval_prompt=force&response_type=code&access_type=offline', '_blank', 'location=no');
        ref.addEventListener('loadstart', function(event) { 
            if((event.url).startsWith("http://localhost/callback")) {
                requestToken = (event.url).split("code=")[1];
                $http({method: "post", url: "https://accounts.google.com/o/oauth2/token", data: "client_id=" + clientId + "&client_secret=" + clientSecret + "&redirect_uri=http://localhost/callback" + "&grant_type=authorization_code" + "&code=" + requestToken })
                    .success(function(data) {
                        accessToken = data.access_token;
                        console.log(accessToken);
                    })
                    .error(function(data, status) {
                        alert("ERROR: " + data);
                    });
                ref.close();
            }
        });
    }
 
    if (typeof String.prototype.startsWith != 'function') {
        String.prototype.startsWith = function (str){
            return this.indexOf(str) == 0;
        };
    }

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