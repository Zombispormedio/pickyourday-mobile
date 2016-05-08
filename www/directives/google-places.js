pydmDrctv.ionGooglePlace = function($ionicTemplateLoader, $ionicPlatform, $q, $timeout, $rootScope, $document) {
    return {
        require: '?ngModel',
        restrict: 'E',
        templateUrl: 'src/ionGooglePlaceTemplate.html',
        replace: false,
        scope: {
            searchQuery: '=ngModel',
            locationChanged: '&',
            radius: '='
        },
        link: function(scope, element, attrs, ngModel) {
            scope.dropDownActive = true;
            scope.ll = "";
            var service = new google.maps.places.AutocompleteService();

            var searchEventTimeout = undefined;
            var latLng = null;

            navigator.geolocation.getCurrentPosition(function (position) {
                latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            });

            var searchInputElement = angular.element(element.find('input'));

            scope.selectLocation = function(location) {
                scope.dropDownActive = true;
                scope.searchQuery = location.description;

                googlePlacesService = new google.maps.places.PlacesService(document.getElementById("map"));
                googlePlacesService.getDetails({
                    reference: location.reference
                }, function(details, status){
                    if(details){
                        scope.ll = details.geometry.location.toString();
                        if (scope.locationChanged) {
                            scope.locationChanged()(location.description, scope.ll);
                        }
                    }
                });

                
            };
            if (!scope.radius) {
                scope.radius = 1500000;
            }

            scope.locations = []

            scope.$watch('searchQuery', function(query) {
                if(query)
                    scope.dropDownActive = (scope.locations.length);

                if (searchEventTimeout) $timeout.cancel(searchEventTimeout);
                searchEventTimeout = $timeout(function() {
                    if(!query) return;
                    /*
                    if (query.length < 3) {
                        scope.locations = [];
                        return;
                    }; */

                    var req = {};
                    req.input = query;
                    if (latLng) {
                        req.location = latLng;
                        req.radius = scope.radius;
                    }

                    //service.getPlacePredictions(req, callbackPlaces);

                    service.getQueryPredictions(req, function (predictions, status) {
                        if (status == google.maps.places.PlacesServiceStatus.OK) {
                            scope.locations = predictions;
                            callbackPlaces(predictions, status);
                            scope.$apply();
                        }
                    });

                }, 350); // we're throttling the input by 350ms to be nice to google's API
            });

            function callbackPlaces(predictions, status) {
                if (status != google.maps.places.PlacesServiceStatus.OK) {
                    console.log(status);
                    return;
                }

                scope.locations = predictions;
                
            };

            var onClick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                scope.dropDownActive = true;
                scope.$digest();
                searchInputElement[0].focus();
                setTimeout(function(){
                    searchInputElement[0].focus();
                },0);
            };

            var onCancel = function(e){
                setTimeout(function () {
                    scope.dropDownActive = true;
                    scope.$digest();
                }, 200);
            };

            element.find('input').bind('click', onClick);
            element.find('input').bind('blur', onCancel);
            element.find('input').bind('touchend', onClick);


            if(attrs.placeholder){
                element.find('input').attr('placeholder', attrs.placeholder);
            }
        }
    };
}