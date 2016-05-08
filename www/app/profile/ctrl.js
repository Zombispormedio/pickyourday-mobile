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
      console.log($scope.user);

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


      console.log(obj);

      if(Object.size(obj) > 0){
          CustomerService.register().update({}, obj , function(result){
            var res = result;
            //console.log(res);
            if (!res.error) {
              $scope.openModal("Tus datos se han modificado correctamente");
            } else {
              console.log(res);
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
    var id = "maps";
    var id2 = "localizacion";

    $scope.initMap = function(){
      
      var map;
      var marker;
      var loc = "";
      var latIni = "";
      var lngIni = "";

      if(latIni == "" || lngIni == ""){
          latIni = "38.5374075";
          lngIni = "-0.1299955";
      }


      $(function() {
          function initialize() {
              if($('#' +id2).val() != "") {
                  var latlng = $('#'+id2).val().replace("(", "").replace(")", "").replace(" ", ""); 
                  $('#'+id2).trigger("change");
                  var currentLat = latlng.split(',')[0];
                  var currentLng = latlng.split(',')[1];
              }
          }

          google.maps.event.addDomListener(window, 'load', initialize);
      });
    }
    
    var autocomplete1, geocoder1;

        function initialize1() {
            // Create the autocomplete object, restricting the search
            // to geographical location types.
            autocomplete1 = new google.maps.places.Autocomplete(
                    (document.getElementById(id)),
                    {
                        types: ["geocode"], componentRestrictions: {
                            country: "es"}
                    });
                             
            geocoder1 = new google.maps.Geocoder();
        }

        function codeAddress1() {
            var address = document.getElementById(id).value;
            geocoder1.geocode( {
                "address": address+", ESPAÑA", "region": "es" }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {

                    document.getElementById(id2).value = results[0].geometry.location;
                   
                    $("#" + id2).trigger("change");

                    var localizacion = results[0].geometry.location;

                    var latlng = $("#" +id2).val().replace("(", "").replace(")", "").replace(" ", ""); 
                    var currentLat = latlng.split(",")[0];
                    var currentLng = latlng.split(",")[1];

                    $scope.user.location.geolocation =  
                    {
                      "lat": currentLat, 
                      "lng": currentLng
                    };
              
                    $scope.user.location.direction = results[0].formatted_address;

                } else {}
            });
        }
        
    $("#" + id).keyup(function(e) {
        e.preventDefault();
        
        if($(this).val() != "") {
            codeAddress1();
        }
    });
        
    $scope.initMap();
    initialize1();
    /*

      name
      birthDate
      gender: male o female
      

    */

}