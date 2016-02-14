pydmCtrl.CompaniesDetailCtrl = function ($rootScope, $scope, $http, $stateParams, CustomerService, $ionicSlideBoxDelegate) {


  var idCompany = $stateParams.idCompany;
  console.log(idCompany);

  $scope.company = [];
  $scope.services = [];
  $scope.reviews = [];

  CustomerService.company().getByID({"id": idCompany}, {}, function(result){
        var res = result;
        if (!res.error) {       
            $scope.company = res.data;    
            $scope.services = res.data.services;
            $scope.reviews = res.data.review;
        } else {
           $scope.error=res.error;
        }

    }, function(){

    });

  $scope.newPick = function (company, service) {
    $rootScope.go("app.newPick", {company: JSON.stringify(company), service: JSON.stringify(service)} );
  }

  $scope.nextSlide = function() {
    $ionicSlideBoxDelegate.next();
  }

  $scope.previousSlide = function() {
    $ionicSlideBoxDelegate.previous();
  }

  $scope.ratingsObject = {
    iconOn : 'ion-ios-star',
    iconOff : 'ion-ios-star-outline',
    iconOnColor: '#fff',
    iconOffColor:  '#fff',
    rating:  4,
    minRating:1,
    callback: function(rating) {
      $scope.ratingsCallback(rating);
    }
  };

  $scope.ratingsCallback = function(rating) {
    console.log('Selected rating is : ', rating);
  };



}
