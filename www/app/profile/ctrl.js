pydmCtrl.ProfileCtrl = function ($rootScope, $scope, $http, ngFB, CustomerService) {

  	$scope.error="";
  	$scope.picks = "";
    $scope.user = {};


    $scope.getProfile = function(){

        CustomerService.profile().list({}, {} , function(result){
            var res = result;
            if (!res.error) {       
              console.log(res);
              $scope.user = res.data;
            } else {
               $scope.error=res.error;
              $scope.openModal(res.error);
            }

        }, function(){

        });

    }
    if(getJSONLocal("userFB")){
      	ngFB.api({
            path: '/me',
            params: {fields: 'id , name, email, gender, link, work'}
        }).then(
        function (user) {
            $scope.user = user;
        },
        function (error) {
          $scope.getProfile();
        });
    }else{
        $scope.getProfile();
    }

}