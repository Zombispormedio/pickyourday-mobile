pydmCtrl.NewPickCtrl = function ($rootScope, $scope, $http, $stateParams,$ionicHistory, CustomerService) {

	var company = JSON.parse($stateParams.company);
	var service = JSON.parse($stateParams.service);

	$scope.company = company;
	$scope.service = service;
	$scope.date = new Date();


	$scope.currentDate = new Date();
	$scope.minDate = new Date();
	$scope.maxDate = new Date(2100, 6, 31);

	$scope.fecha = new Date();
	 
	$scope.datePickerCallback = function (val) {
		if (!val) {	
			console.log('Date not selected');
		} else {
			console.log('Selected date is : ', val);
			$scope.date = val;
		}
	};

	$scope.newPick = function () {


		if ($scope.company._id !== "" && $scope.service._id !== "" && $scope.date !== "") {

			var obj = {
				"initDate" : $scope.fecha,
				"state": "active",
				"company": {
					"id_company": $scope.company._id,
					"id_service": $scope.service._id
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