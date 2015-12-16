pydmCtrl.ProfileCtrl = function ($rootScope, $scope, $http, ngFB) {

  	$scope.error="";
  	$scope.picks = "";
  
  	ngFB.api({
        path: '/me',
        params: {fields: 'id,name, email, gender, link, work'}
    }).then(
    function (user) {
        $scope.user = user;
    },
    function (error) {
    	$scope.error=  error.error_description;
		$scope.openModal();
    });

}