pydmCtrl.CompaniesDetailCtrl = function ($rootScope, $scope, $http, $stateParams, CustomerService, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicModal) {


  var idCompany = $stateParams.idCompany;

  $scope.userRate = 0;
  $scope.company = [];
  $scope.services = [];
  $scope.reviews = [];
  $scope.schedule = [];
  $scope.msg = "Cargando ...";

  CustomerService.company().getByID({"id": idCompany}, {}, function(result){
        var res = result;
        if (!res.error) {       
            $scope.company = res.data;    
            $scope.services = res.data.services;
            console.log(res.data.services);
            $scope.reviews = res.data.review;
            $scope.schedule = $scope.orderSchedule(res.data.scheduleActivity);            
            $scope.prepareGraphic();
        } else {
           $scope.error=res.error;
           $scope.msg = "No se han encontrado resultados.";
        }

    }, function(){

    });

  $scope.rating = {};
  $scope.rating.rate = 4.3;
  //$scope.rating.max = 5;

  $scope.orderSchedule = function(s){

    var scd = [];
    var weekday = new Array(7);
    weekday[0]=  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    if(s.length > 0){
       var res = s[0].week.filter(function (e) { 
          var d1 = new Date();
          var day = d1.getDay();
          return ( weekday[day] == e.day );
        });

      if(res.length > 0)
        scd.push(res[0]);

      angular.forEach(s[0].week, function (data, index) {
          scd.push(data);
      });

      return scd;

     }else{
       return s;
     }

   
  }

  Array.prototype.max = function() {
    return Math.max.apply(null, this); // <-- passing null as the context
  };

  $scope.prepareGraphic = function(){

    var arr = [];
    angular.forEach($scope.company.review_ratings, function (rev, index) {
        if(index != "avg") 
          arr[index-1] = rev;
    });

    var max = arr.max();
    
    var wid = [];

    if(max > 0){
      angular.forEach($scope.company.review_ratings, function (rev, index) {
        if(index != "avg") 
            wid[index-1] = (rev/max)*100;
      });
    }else{
      wid = [0,0,0,0,0];
    }

    $scope.widths = wid;
    
  }

  $scope.newPick = function (idCompany, idService) {
    $rootScope.go("app.newPick", {company: idCompany, service: idService} );
  }

  $scope.nextSlide = function() {
    $ionicSlideBoxDelegate.next();
  }

  $scope.previousSlide = function() {
    $ionicSlideBoxDelegate.previous();
  }

  $scope.openTimetable = function(){

    if( $(".timetable ul").hasClass("open") ){
      $(".timetable ul").removeClass("open");
      $(".timetable ul").slideUp();
      $(".timetable .down").removeClass("open");
      
    }else{
      $(".timetable ul").addClass("open");
      $(".timetable ul").slideDown();
      $(".timetable .down").addClass("open");
      setTimeout(function(){
        $ionicScrollDelegate.resize();
      }, 300);

      
    }

  };

  $scope.openPhone = function(){

    if( $(".phoneContainer ul").hasClass("open") ){
      $(".phoneContainer ul").removeClass("open");
      $(".phoneContainer ul").slideUp();
      $(".phoneContainer .down").removeClass("open");
    }else{
      $(".phoneContainer ul").addClass("open");
      $(".phoneContainer ul").slideDown();
      $(".phoneContainer .down").addClass("open");
      setTimeout(function(){
        $ionicScrollDelegate.resize();
      }, 200);
    }

  };

  $(document).ready(function(){
    var nums = $(".detail .left .barFilled").data("val");
    console.log(nums);
  })

   $scope.ratingsObject = {
      iconOn: 'ion-ios-star',
      iconOff: 'ion-ios-star-outline',
      iconOnColor: '#FF9800',
      iconOffColor: '#FF9800',
      rating: 0,
      minRating: 0,
      readOnly:false,
      callback: function(rating) {
        $scope.ratingsCallback(rating);
      }
    };

    $scope.ratingsObject2 = {
      iconOn: 'ion-ios-star',
      iconOff: 'ion-ios-star-outline',
      iconOnColor: '#FF9800',
      iconOffColor: '#FF9800',
      rating: 0,
      minRating: 0,
      readOnly:false,
      callback: function(rating) {
        $scope.ratingsCallback2(rating);
      }
    };

    $scope.colourStars = function(rate){
      for(var i=1; i<=10; i+=2){
        if(i<(rate*2)){
          $(".userRating span:nth-child("+i+")").addClass("ng-hide");
          $(".userRating span:nth-child("+ (i+1) +")").removeClass("ng-hide");
        }else{
          $(".userRating span:nth-child("+i+")").removeClass("ng-hide");
          $(".userRating span:nth-child("+ (i+1) +")").addClass("ng-hide");
        }
      }
    }


    $scope.ratingsCallback = function(rating) {
        $scope.userRate = rating;
        $scope.openNewReview();  
        $scope.colourStars(rating); 
        console.log('Selected rating is : ', rating);
    };

    $scope.ratingsCallback2 = function(rating) {      
        $scope.userRate = rating;
        $scope.colourStars(rating); 
        console.log('Selected rating 2 is : ', rating);
    };

    $ionicModal.fromTemplateUrl('app/companyDetail/reviews/newReview/main.html', {
      scope: $scope,
      animation: 'slide-in-right'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.openNewReview = function() {
        $scope.modal.show();       
    };

    $scope.closeNewReview = function() {
        $scope.modal.hide();
    };

    $scope.textReview = "";

    $scope.sendReview = function(){
      var msg = $("#textReview").val();
      var rate = $scope.userRate;
      console.log(msg + " - " + rate);

      var obj = {
          "company_id" : idCompany, 
          "rating": rate, 
          "description": msg
      }

      CustomerService.review().create({}, obj, function(result){
            var res = result;
            console.log(res);
            if (!res.error) {       
                $scope.prepareGraphic();
                $scope.closeNewReview();
                window.location.reload(true);
            } else {
               $scope.error=res.error;
               $scope.openModal(res.error);
            }
      }, function(){

      });

    }

    $scope.userReview = [];

    $scope.getUserReview = function(){

      CustomerService.review().list({"company": idCompany}, {}, function(result){
          var res = result;
          console.log(res);
          if (!res.error) {       
            $scope.userReview = res.data;
            console.log($scope.userReview.length);
          } else {
             $scope.error=res.error;           
          }

      }, function(){

      });

    }

    $scope.getUserReview();

    $scope.subscribe = function(){
      $(".subscribe").toggleClass("active");
    }
   

}
