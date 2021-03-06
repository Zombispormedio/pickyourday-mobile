pydmCtrl.DashboardCtrl = function ($rootScope, $scope, $state, $http, $ionicHistory, CustomerService, $ionicModal, $ionicPopup) {
  
  $scope.error="";
  $scope.picks = "";
  $scope.msg = "Cargando ...";


	$scope.getPicks = function(){

    
		CustomerService.pick().list({afterInitDate: new Date()}, {} , function(result){
            var res = result;
            if (!res.error) {       
              	var picksAux = res.data;
        				$scope.picks = picksAux;		
                console.log(picksAux);
                if(picksAux.length == 0)
                 $scope.msg = "No tienes picks activos";               
        				$scope.$broadcast('scroll.refreshComplete');	
            } else {
               	$scope.error=res.error;
                $scope.msg = "No tienes picks activos";
				        $scope.$broadcast('scroll.refreshComplete');
            }

        }, function(){

        });
	}

  $scope.getPicks();
  
  $scope.promotions = [];

  $scope.getPromotions = function(){

    CustomerService.promotion().list({}, {} , function(result){
      var res = result;
      //console.log(res);
      if (!res.error) {       
          $scope.promotions = res.data;    
      } else {
          $scope.error=res.error;
      }

    }, function(){

    });
  } 

  $scope.getPromotions(); 
  

	$scope.doRefresh = function() {
		$scope.getPicks();
	}

	$scope.$on('$ionicView.enter', function() {
    	$scope.getPicks();
	});

	$scope.cleanError=function(){
		$scope.error="";
	}

  $scope.pickDetail = function(pick){
    $scope.currentPick = pick;
    $scope.openPickDetail();
  }

  $ionicModal.fromTemplateUrl('app/dashboard/pickDetail/main.html', {
      scope: $scope,
      animation: 'slide-in-right'
  }).then(function(modal) {
      $scope.modal = modal;
  });

  $scope.openPickDetail = function() {
      $scope.modal.show();
  };

  $scope.closePickDetail = function() {
      $scope.modal.hide();
  };

  $scope.cancelPick = function(id) {

    CustomerService.cancelPick().cancel({"id": id}, {} , function(result){
        var res = result;
        //console.log(res);
        if (!res.error) {       
           $scope.closePickDetail();
           $state.go($state.current, {}, {reload: true});
        } else {
           $scope.error=res.error;
           $scope.openModal($scope.error);
        }

    }, function(){

    });

  }

  $scope.showConfirm = function(id) {
   var confirmPopup = $ionicPopup.confirm({
     title: 'Cancelar Pick',
     template: '¿Estás seguro de que deseas cancelar el pick?'
   });

   confirmPopup.then(function(res) {
     if(res) {
       $scope.cancelPick(id);
     } else {
       console.log('You are not sure');
     }
   });

 };

 $scope.goCompany = function(id, services){
    $scope.closePickDetail();
    if(!services)
      $rootScope.go("app.companyDetail", {idCompany: id });
    else
      $rootScope.go("app.companyDetail.services", {idCompany: id });
 }


}