pydmCtrl.MenuCtrl = function ($rootScope, $scope, $ionicSideMenuDelegate, $http, $ionicModal, ngFB, OauthService) {
	
	$scope.toggleLeftSideMenu = function(){
		$ionicSideMenuDelegate.toggleLeft();
	}

	$scope.logout = function () {

		OauthService.logout().Session({}, $scope.user , function(result){
            var res = result;
            if (!res.error) {       
              	deleteLocal("user");
				deleteLocal("facebook");
				deleteLocal("google");
				$rootScope.go("login");
            } else {
               	$scope.error=res.error;
				$scope.openModal(res.error);
            }

        }, function(){

        });

	}


	$scope.cleanError=function(){
			$scope.error="";
	}

}