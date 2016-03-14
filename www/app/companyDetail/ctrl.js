pydmCtrl.CompaniesDetailCtrl = function ($rootScope, $scope, $http, $stateParams, CustomerService, $ionicSlideBoxDelegate, $ionicScrollDelegate) {


  var idCompany = $stateParams.idCompany;

  $scope.userRate = 0;
  $scope.company = [];
  $scope.services = [];
  $scope.reviews = [];

  CustomerService.company().getByID({"id": idCompany}, {}, function(result){
        var res = result;
        if (!res.error) {       
            $scope.company = res.data;    
            $scope.services = res.data.services;
            $scope.reviews = res.data.review;

            $scope.prepareGraphic();
        } else {
           $scope.error=res.error;
        }

    }, function(){

    });

  $scope.rating = {};
  $scope.rating.rate = 4.3;
  //$scope.rating.max = 5;

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
    $rootScope.go("app.newPick", {company: JSON.stringify(idCompany), service: JSON.stringify(idService)} );
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


}
