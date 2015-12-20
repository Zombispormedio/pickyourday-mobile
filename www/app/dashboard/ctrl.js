pydmCtrl.DashboardCtrl = function ($rootScope, $scope, $http, $ionicHistory, CustomerService) {
  	$scope.error="";
  	$scope.picks = "";

	$scope.getPicks = function(){

		CustomerService.pick().list({afterInitDate: new Date()}, {} , function(result){
            var res = result;
            if (!res.error) {       
              	var picksAux = res.data;
				$scope.picks = picksAux;			
				$scope.$broadcast('scroll.refreshComplete');	
            } else {
               	$scope.error=res.error;
				$scope.$broadcast('scroll.refreshComplete');
            }

        }, function(){

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