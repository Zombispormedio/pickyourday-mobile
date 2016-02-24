pydmCtrl.PreferencesCtrl = function($scope, CustomerService){
    CustomerService.preferences().list({}, function(result){
        console.log(result);
    }, function(){});
}