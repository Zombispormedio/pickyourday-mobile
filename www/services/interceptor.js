pydmFtry.AuthInterceptor = function($q, $location){
    return {
        request: function(config){
            config.headers = config.headers || {};
            
            var aux = config.url.split("?");

            if(aux.length > 1){
                var parts = aux[1].split(/=|&/);
                var url = "";
                
                for(var i=0; i<parts.length; i+=2){

                    if(i<parts.length-2){
                        url += parts[i] + "=" + encodeURIComponent(parts[i+1]) + "&";
                    }else{
                        url += parts[i] + "=" + encodeURIComponent(parts[i+1]);
                    }
                
                }

                config.url = aux[0] + "?" + url;
            }
           
            var user=getJSONLocal("user");

            if (!config.headers.Authorization && user) {
                config.headers.Authorization = user.token;
            }
			
			
            return config;
        },
        requestError: function(rejection) {
            return $q.reject(rejection);
        },
        response: function(response){
            if(response.data.status === 'ERROR') { //Force error
                return $q.reject(response);
            }
            return response || $q.when(response);
        },
        responseError: function(rejection){
            if(rejection.status === 403) {
                console.error('Error de acceso');
                localStorage.user = '';
                $location.path('/');
                return;
            }
            return $q.reject(rejection);
        }
    }
}