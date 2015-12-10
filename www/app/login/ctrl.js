pydmCtrl.LoginCtrl = function ($rootScope, $scope, $http, $ionicModal) {
	$scope.error="";
	$scope.user = {};
	$scope.login = function () {
		if ($scope.user.email !== "" && $scope.user.password !== "") {
			$http.post("http://pickyourday.herokuapp.com/api/oauth", $scope.user).then(function successCallback(response) {
				var res = response.data;
				if (!res.error) {
					saveLocal("user", response.data.data);
					$rootScope.go("app.dashboard");
				} else {
					$scope.error=res.error;
					$scope.openModal();
				}

			}, function errorCallback(response) {

			});
		}

	}

	$scope.cleanError=function(){
			$scope.error="";
	}

	$scope.openModal = function() {
    $ionicModal.fromTemplateUrl('app/login/modal.html', {
      scope: $scope,
      animation: 'fade-in-scale'
	    }).then(function(modal) {
	      $scope.modal = modal;
	      $scope.modal.show();
	    });
	  };
	  $scope.closeModal = function() {
	    $scope.modal.hide();
	  };
	  //Cleanup the modal when we're done with it!
	  $scope.$on('$destroy', function() {
	    $scope.modal.remove();
	  });
	  // Execute action on hide modal
	  $scope.$on('modal.hidden', function() {
	    // Execute action
	  });
	  // Execute action on remove modal
	  $scope.$on('modal.removed', function() {
	    // Execute action
	  });
}