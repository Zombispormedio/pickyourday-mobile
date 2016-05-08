pydmCtrl.ProfileCtrl = function ($rootScope, $scope, $http, ngFB, CustomerService) {

  	$scope.error="";
  	$scope.picks = "";
    $scope.user = {};
    $scope.image = "";
    $scope.location = "";


    $scope.getProfile = function(){
        CustomerService.profile().list({}, {} , function(result){
            var res = result;
            if (!res.error) {       
              $scope.user = res.data;
              if($scope.user.birthDate)
                $scope.user.birthDate = new Date($scope.user.birthDate);
              //console.log("USEEER");
              //console.log($scope.user);
            } else {
              $scope.error=res.error;
              $scope.openModal(res.error);
              //console.log(res.error);
            }

        }, function(){

        });

    }

    Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
    };

    $scope.updateProfile = function(){
      
      var obj = {};
      //console.log($scope.user);

      if(Object.size($scope.user.location.geolocation) >0 || $scope.user.location.direction)
        obj.location = {};

      if($scope.user.name && $scope.user.name != "")
        obj.name = $scope.user.name;
      if($scope.user.gender && $scope.user.gender != "")
        obj.gender = $scope.user.gender;
      if(Object.size($scope.user.location.geolocation) >0)
        obj.location.geolocation = $scope.user.location.geolocation;
      if($scope.user.location.direction && $scope.user.location.direction != "")
        obj.location.direction = $scope.user.location.direction;
      if($scope.user.birthDate)
        obj.birthDate = $scope.user.birthDate;


     //console.log(obj);

      if(Object.size(obj) > 0){
          CustomerService.register().update({}, obj , function(result){
            var res = result;
            //console.log(res);
            if (!res.error) {
              $scope.openModal("Tus datos se han modificado correctamente");
            } else {
              //console.log(res);
              $scope.openModal(res.error.message);
            }
          });
      }
     
    }

   


    if(getJSONLocal("facebook")){
        $http.get("https://graph.facebook.com/v2.2/me", {params: {access_token: getJSONLocal("facebook"), fields: "email,age_range ,name,gender,location,picture.width(400)", format: "json" }}).then(function(result) {
          $scope.image = result.data.picture.data.url;
        }, function(error) {
             
        });
    }else if(getJSONLocal("google")){
      $http({method: "get", url: "https://www.googleapis.com/plus/v1/people/me", headers: {'Content-Type': 'application/json', 'Authorization':  'Bearer '+getJSONLocal("google") }}).then(function(result) {

          if(result.data.image)
            $scope.image = (result.data.image.url).replace("sz=50","sz=400");

        }, function(error) {
          
        });      
    }
   
    $scope.getProfile();

    $scope.locationChanged = function (location, ll) {
      //console.log(location);
      //console.log(ll);

      var latlng = ll.replace("(", "").replace(")", "").replace(" ", ""); 
      var currentLat = latlng.split(',')[0];
      var currentLng = latlng.split(',')[1];

      $scope.user.location.geolocation =  
      {
        "latitude": currentLat, 
        "longitude": currentLng
      };

      $scope.user.location.direction = location;
      
      $(".ion-place-tools-autocomplete-dropdown").slideUp();

    };

    $(document).ready(function(){

       setTimeout(function(){
          $(".profile .ion-place-tools-autocomplete input").keyup(function(e) {
              e.preventDefault();
              //console.log("EH");
              if($(this).val() != "") {
                  $(".ion-place-tools-autocomplete-dropdown").slideDown();
              }
          });
       }, 300);
       
       
    });

}