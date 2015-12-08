pydmCtrl.MenuCtrl = function ($rootScope, $scope, $ionicSideMenuDelegate) {
	
	$scope.toggleLeftSideMenu = function(){
		$ionicSideMenuDelegate.toggleLeft();
	}
}