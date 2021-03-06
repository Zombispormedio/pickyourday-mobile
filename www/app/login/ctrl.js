pydmCtrl.LoginCtrl = function ($rootScope, $scope, $http, $ionicModal, ngFB, $ionicSlideBoxDelegate, OauthService, CustomerService, $ionicLoading, $cordovaOauth) {
	$scope.error="";
	$scope.exists = "";
	$scope.user = {};
	$scope.userR = {};
	$scope.accessToken = "";


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

			OauthService.login().Session(obj , function(result){
	            var res = result;		

	            if (!res.error) {       	       
	            	saveLocal("user", res.data);       
	            	$scope.errorR = "";
					$rootScope.go("app.dashboard");
	            } else {	               	
					$scope.openModal(res.error);
	            }

	        }, function(){

	        });
		}else{
			$scope.errorR = "Rellena tus datos";
		}

	}

	function existsUser(id, email, name, social){
		if (email !== "") {
			OauthService.check().list({email: email}, {} , function(result){
	            var res = result;
	            $scope.exists = res.data;
				$scope.register(id, email, name, social);
	        }, function(){
				$scope.openModal("Server not found");
	        });
		}
	}

	$scope.register = function (id, email, name, social){
		if ( ($scope.userR.email  && $scope.userR.password && $scope.userR.password2 ) || (id && email) ) {

			if(id && email){

				if(!name)
					name = "";

				var obj = {
					"email" : email,
					"password" : id,
					"name" : name,
					"social" : social
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


	
	$scope.registerWithFb = function (token){
 		console.log(token);

 		$http.get("https://graph.facebook.com/v2.2/me", {params: {access_token: token, fields: "email,age_range,name,gender,location,picture.width(400)", format: "json" }}).then(function(result) {
    		saveLocal("facebook", $scope.accessToken);
    		existsUser(result.data.id, result.data.email, result.data.name, "Facebook");
    		console.log(result.data);	
	    }, function(error) {
	        $scope.openModal("Error: " + error);
	    });
		/*
		ngFB.api({
	        path: '/me',
	        params: {fields: 'id, email'}
	    }).then(
	    function (user) {
	        existsUser(user.id, user.email);
	        $scope.openModal(JSON.stringify(user));
	        if(email && id)
				saveLocal("userFB", id);
	    },
	    function (error) {
	    	$scope.error=  error.error_description;
			$scope.openModal(error.error_description);
	    });
	    */
	}
	
	
	$scope.fbLogin = function () {
	    ngFB.login({scope: 'email'}).then(
	        function (response) {
	            if (response.status === 'connected') {
	                console.log('Facebook login succeeded');
	                $scope.accessToken = response.authResponse.accessToken;
	                $scope.registerWithFb(response.authResponse.accessToken);
	            } else {
	                alert('Facebook login failed');
	            }
	        });
	};
	
	var clientId = "492674088302-eg1tjtks9t05qen8u753fjvbde4ndb1e.apps.googleusercontent.com";
	$scope.googleSignIn = function(){
		$cordovaOauth.google(clientId, ["email", "profile"]).then(function(result) {
		    $scope.accessToken = result.access_token;
		    $http({method: "get", url: "https://www.googleapis.com/plus/v1/people/me", headers: {'Content-Type': 'application/json', 'Authorization':  'Bearer '+result.access_token }})
            .success(function(data) {
	    		var id = data.id;
	    		var googleEmail = data.emails[0].value;

	 			saveLocal("google", $scope.accessToken);
	    		existsUser(id, data.emails[0].value, data.displayName, "Google");
	    	})
	    	.error(function(data, status) {
	    		$scope.openModal(data);
	    	});        

		}, function(error) {
		    $scope.openModal(error);
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

  	$scope.errorR = "";
  	$scope.rememberPass = function(){
  		if($scope.user.email){
  			OauthService.forgotPassword().set($scope.user, function(result){
				if(result.error){
					$scope.errorR = result.error;
					console.log(result.error);
				}else{
					$scope.msg = "Recibirás un email con tu código, no cierres esta ventana";
					$scope.openModalPass();
					console.log(result);
				}
			}, function(){
			});
  		}else{
  			$scope.errorR = "Introduce tu email";
  			console.log($scope.errorR);
  		}
  	}

  	$scope.userP = {};

  	$scope.resetPassword = function(){
        OauthService.resetPassword().reset($scope.userP,function(result){
            if(result.error){
              $scope.openModal(result.error);
            }
          	else{
            	console.log(result);
            	$scope.openModal("Contraseña cambiada correctamente.");
            	$scope.closeModalPass();
            	$scope.errorR = "";
            	$scope.userP = {};
          	}
        }, function(){

        });
    }


  	//Search preferences
	$ionicModal.fromTemplateUrl('app/login/forgotPassword/main.html', {
	    scope: $scope,
	    animation: 'slide-in-right'
	}).then(function(modal) {
	    $scope.modalPass = modal;
	});

	$scope.openModalPass = function() {
	    $scope.modalPass.show();
	};

	$scope.closeModalPass = function() {
	    $scope.modalPass.hide();
	};

}