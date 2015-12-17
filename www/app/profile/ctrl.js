pydmCtrl.ProfileCtrl = function ($rootScope, $scope, $http, ngFB) {

  	$scope.error="";
  	$scope.picks = "";
    $scope.user = {};

    $scope.getProfile = function(){
        $http.get("http://pickyourday.herokuapp.com/api/customer/profile").then(function successCallback(response) {
          var res = response.data;
          if (!res.error) {
            $scope.user = response.data.data;
            //saveLocal("user", response.data.data);
          } else {
            $scope.error=res.error;
            $scope.openModal(res.error);
          }

        }, function errorCallback(response) {

        });
    }
    if(getJSONLocal("userFB")){
      console.log(getJSONLocal("userFB"));
      	ngFB.api({
            path: '/me',
            params: {fields: 'id , name, email, gender, link, work'}
        }).then(
        function (user) {
            $scope.user = user;
        },
        function (error) {
        	//$scope.error=  error.error_description;
    		  //$scope.openModal();
          $scope.getProfile();
        });
    }else{
        $scope.getProfile();
    }

}