pydmCtrl.NewPickCtrl = function ($rootScope, $scope, $http, $stateParams,$ionicHistory, CustomerService) {
	
	var idCompany = $stateParams.company;
	var idService = $stateParams.service;

	$scope.company = [];
	$scope.service = [];

	$scope.idCompany = idCompany;
	$scope.idService = idService;

	$scope.date = new Date();


	$scope.currentDate = new Date();
	$scope.minDate = new Date();
	$scope.maxDate = new Date(2100, 6, 31);

	$scope.fecha = new Date();

	CustomerService.company().getByID({"id": $scope.idCompany}, {}, function(result){
        var res = result;
        if (!res.error) {       
            $scope.company = res.data;    
        } else {
           $scope.error=res.error;
        }
    }, function(){

    });

   	CustomerService.service().getByID({"id": $scope.idService, "company": $scope.idCompany }, {}, function(result){
        var res = result;
        console.log(result);
        if (!res.error) {       
            $scope.service = res.data;    
        } else {
           $scope.error=res.error;
        }
    }, function(){

    });


	 
	$scope.datePickerCallback = function (val) {
		if (!val) {	
			console.log('Date not selected');
		} else {
			console.log('Selected date is : ', val);
			$scope.date = val;
		}
	};

	$scope.newPick = function () {


		if ($scope.idCompany !== "" && $scope.idService !== "" && $scope.date !== "") {

			var obj = {
				"initDate" : $scope.fecha,
				"state": "active",
				"company": {
					"id_company": $scope.idCompany,
					"id_service": $scope.idService
				}
			}
			
			CustomerService.pick().create({}, obj , function(result){
				var res = result;
				if (!res.error) {				
					$rootScope.go("app.dashboard");
				} else {
					$scope.error=res.error;
					$scope.openModal();
				}

            }, function(){

            });

		}

	}

	$scope.$on('$ionicView.enter', function() {
		var back = $ionicHistory.backView().stateName;
		if(back != "app.companiesDetail")
    		$rootScope.go("app.dashboard");
	});


	$scope.beforeRender = function ($view, $dates, $leftDate, $upDate, $rightDate) {

	    var threeMonthsLater = moment().add(3, 'months');
	    for(var i=0; i<$dates.length;i++) {
	       if(moment() > $dates[i].utcDateValue && $dates[i].utcDateValue <= threeMonthsLater ) {
	          $dates[i].selectable = false;
	       }
	    }     
	}

	/*
	$scope.beforeRender = function ($view, $dates, $leftDate, $upDate, $rightDate) {
        var threeMonthsLater = moment().add(3, 'months');
        for(var index=0;index<$dates.length;index++) {
            $dates[index].selectable = moment($dates[index].utcDateValue).isBetween(moment(),threeMonthsLater);            
        }
    }
    */

	$scope.onTimeSet = function (newDate, oldDate) {
		$scope.fecha = newDate;
	    console.log(newDate);
	    console.log(oldDate);
	}


	

}