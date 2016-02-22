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
    if(getJSONLocal("facebook")){
        $http.get("https://graph.facebook.com/v2.2/me", {params: {access_token: getJSONLocal("facebook"), fields: "email,age_range ,name,gender,location,picture.width(400)", format: "json" }}).then(function(result) {
          $scope.user = result.data;
          console.log($scope.user);
        }, function(error) {
             $scope.getProfile();
        });
    }else if(getJSONLocal("google")){
      $http({method: "get", url: "https://www.googleapis.com/plus/v1/people/me", headers: {'Content-Type': 'application/json', 'Authorization':  'Bearer '+getJSONLocal("google") }}).then(function(result) {
          $scope.user = result.data;

          if(result.data.image)
            $scope.googleImage = (result.data.image.url).replace("sz=50","sz=400");

          console.log($scope.user);
        }, function(error) {
             $scope.getProfile();
        });      
      console.log("GOOOGLE");
    }else{
        $scope.getProfile();
    }

}