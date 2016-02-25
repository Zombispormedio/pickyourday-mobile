pydmCtrl.PreferencesCtrl = function($scope, CustomerService, $ionicModal,  $ionicPopup){

    $scope.selectedPref=null;

    $ionicModal.fromTemplateUrl('app/preferences/questions/main.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };


    $scope.selectGroup=function(group){
        $scope.selectedPref=group;
        $scope.openModal();

    }

    $scope.closeGroup=function(){
        $scope.selectedPref=null;
        $scope.closeModal();
    }


    $scope.activeQuestion=function(question){
        if(question.type==="keywords"){
            $scope.keywordsPopup(question);
        }else{
            question.active=!question.active;
        }

    }

    $scope.keywordsPopup=function(question){
        $scope.aux={};
        var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="aux.keyword">',
            title: "¿"+question.text+"?",
            scope: $scope,
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                       
                        return $scope.aux.keyword;
                    }
                }
            ]
        });

        myPopup.then(function(res) {
            question.answer=$scope.aux.keyword;
        
       
            myPopup.close();
        });
    }

    this.listPreferences=function(){
        CustomerService.preferences().list({}, function(result){
            if(result.error)return console.log(result.error);

            $scope.preferences=result.data;
        }, function(){});
    };

    this.listPreferences();



}