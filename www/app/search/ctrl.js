pydmCtrl.SearchCtrl = function ($rootScope, $scope, $http, ngFB, CustomerService, $ionicScrollDelegate, $ionicModal, $ionicSideMenuDelegate, $stateParams) {

	$scope.error="";

	$scope.companies = [];
  $scope.services = [];
  $scope.prepicks = [];
  $scope.msgS = "Cargando ...";
  $scope.msgC = "Cargando ...";

  $scope.searchText = "";
  $scope.order = "price";

  $scope.search = function(){

    $scope.msgS = "Cargando ...";
    $scope.msgC = "Cargando ...";

    var category = "";
    $scope.services = [];
    $scope.companies = [];
    if($scope.data.selCategory)
      category = $scope.data.selCategory._id;

      CustomerService.search().list({"name": $scope.searchText, "category": category, "location.city": $scope.city}, {}, function(result){
          var res = result;
          if (!res.error) {       
              console.log(res);
              $scope.companies = res.data.companies;    
              if($scope.companies.length == 0)
                $scope.msgC = "No se han encontrado resultados.";

              $scope.services = res.data.services;
              if($scope.services.length == 0)
                $scope.msgS = "No se han encontrado resultados.";

              $scope.prepicks = res.data.prepicks;
          } else {
             $scope.error=res.error;
             $scope.msgS = "No se han encontrado resultados.";
             $scope.msgC = "No se han encontrado resultados.";
             console.log(res.error);
          }
      }, function(){

      });
  };

  //Infinite scroll
  $scope.loadMore = function() {
    //llamada a la api
      $scope.$broadcast('scroll.infiniteScrollComplete');
  };

  $scope.$on('$stateChangeSuccess', function() {
    $scope.loadMore();
  });

  //Search preferences
  $ionicModal.fromTemplateUrl('app/search/config/main.html', {
      scope: $scope,
      animation: 'slide-in-right'
  }).then(function(modal) {
      $scope.modal = modal;
  });

  $scope.openModal = function() {
      $scope.modal.show();
  };

  $scope.closeModal = function() {
      $scope.search();
      $scope.modal.hide();
  };

  //Categories
  $ionicModal.fromTemplateUrl('app/search/categories/main.html', {
      scope: $scope,
      animation: 'scale-in'
  }).then(function(modal) {
      $scope.categories_popup = modal;
  });

  $scope.openCategories = function() {
      $scope.categories_popup.show();
  };

  $scope.closeCategories = function() {
      $scope.search();
      $scope.categories_popup.hide();
  };

  $scope.categories = "";
  $scope.data = {
    selCategory: ''
  };

  if($stateParams.idCategory != ""){
    var idCat = $stateParams.idCategory;
    CustomerService.category().getByID({"id": idCat}, {}, function(result){
        var res = result;
        if (!res.error) {       
            $scope.data.selCategory = res.data;    
            $scope.search();
        } else {
           $scope.error=res.error;
           console.log(res.error);
        }
    }, function(){

    });
  }

  $scope.getCategories = function(){
    CustomerService.category().list({}, {} , function(result){
          var res = result;
          if (!res.error) {       
              $scope.categories = res.data;   
          } else {
             $scope.error=res.error;
          }

      }, function(){

      });
  };

  $scope.getCategories();

  //Location
  $scope.city = "";
  $scope.country = "";

  $ionicModal.fromTemplateUrl('app/search/location/main.html', {
      scope: $scope,
      animation: 'scale-in'
  }).then(function(modal) {
      $scope.location_popup = modal;
  });

  $scope.openLocation = function() {
      $scope.location_popup.show();
  };

  $scope.closeLocation = function() {
      $scope.search();
      $scope.location_popup.hide();
  };

  $scope.locationChanged = function (location, ll) {
    console.log(location);
    var aux = location.split(",");
    var i1 = aux.length - 1;
    var i2 = aux.length - 2;
    var country = "";
    var city = "";

    if(aux[i1] )
      $scope.country = aux[i1];
    else
      $scope.country = "";

    if( aux[i2])
      $scope.city = aux[i2];
    else
      $scope.city = "";
  };

  $scope.clearCity = function(){
    $scope.city = "";
  }

  $scope.clearCountry = function(){
    $scope.country = "";
  } 

  //Dates
  $scope.currentDate = new Date();
  $scope.minDate = new Date();
  $scope.maxDate = new Date(2100, 6, 31);

  $scope.date = new Date();
  $scope.dateFrom = "";
  $scope.dateTo = "";
   
  $scope.datePickerCallback = function (val) {
    if (!val) { 
      console.log('Date not selected');
    } else {
      console.log('Selected date is : ', val);
      $scope.date = val;
    }
  };

  $scope.onTimeSet = function (newDate, oldDate) {
    if($scope.dateType == "from")
      $scope.dateFrom = newDate;
    else if($scope.dateType == "to")
      $scope.dateTo = newDate;
  }

  $scope.beforeRender = function ($view, $dates, $leftDate, $upDate, $rightDate) {

      var threeMonthsLater = moment().add(3, 'months');
      for(var i=0; i<$dates.length;i++) {
         if(moment() > $dates[i].utcDateValue && $dates[i].utcDateValue <= threeMonthsLater ) {
            $dates[i].selectable = false;
         }
      }     
  }

  $ionicModal.fromTemplateUrl('app/search/dates/main.html', {
      scope: $scope,
      animation: 'scale-in'
  }).then(function(modal) {
      $scope.dates_popup = modal;
  });

  $scope.openDates = function(t) {
      $scope.dateType = t;
      $scope.dates_popup.show();
  };

  $scope.closeDates = function() {
      $scope.dates_popup.hide();
  };

  $scope.clearDate = function(){
    if($scope.dateType == "from")
      $scope.dateFrom = "";
    else if($scope.dateType == "to")
      $scope.dateTo = "";
  }

  //Search input
  $scope.$watch('searchText', function (val) {
    if(val){
      $scope.searchText = val;
      $scope.search();
    }else{
      val = "";
      if($stateParams.idCategory == "")
        $scope.search();
    }
  })

	$scope.scrollTop = function() {
		$ionicScrollDelegate.scrollTop();
	};


  //Navigation
	$scope.goDetail = function (idCompany) {
    $rootScope.go("app.companyDetail", {idCompany: idCompany });
  }

  $scope.newPick = function (idCompany, idService) {
    $rootScope.go("app.newPick", {company: idCompany, service: idService} );
  }

  $scope.cleanError=function(){
      $scope.error="";
  }
  

  $rootScope.$on('$ionicView.enter',
  function(){
    $ionicSideMenuDelegate.edgeDragThreshold(50);
  });
  

}