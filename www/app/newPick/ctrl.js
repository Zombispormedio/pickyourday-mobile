pydmCtrl.NewPickCtrl = function ($rootScope, $scope, $http, $stateParams,$ionicHistory) {

	var company = JSON.parse($stateParams.company);
	var service = JSON.parse($stateParams.service);

	$scope.company = company;
	$scope.service = service;
	$scope.date = new Date();


	$scope.currentDate = new Date();
	$scope.minDate = new Date();
	$scope.maxDate = new Date(2100, 6, 31);
	 
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
				"initDate" : $scope.date,
				"state": "active",
				"company": {
					"id_company": $scope.company._id,
					"id_service": $scope.service._id
				}
			}
			/*
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
			*/
			$http.post("http://pickyourday.herokuapp.com/api/customer/pick", obj).then(function successCallback(response) {
				var res = response.data;
				if (!res.error) {				
					$rootScope.go("app.dashboard");
				} else {
					$scope.error=res.error;
					$scope.openModal();
				}

			}, function errorCallback(response) {

			});
	

		}

	}

	$scope.$on('$ionicView.enter', function() {
		
		var back = $ionicHistory.backView().stateName;
		if(back != "app.companiesDetail")
    		$rootScope.go("app.dashboard");
	});

	

}