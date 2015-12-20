pydmFtry.OauthService= function(ApiService){
    return {

        base:"oauth",
        login:function(){
            return ApiService.rest(this.base,{
                Session:{method:"POST", params:{}}
            });
        },
        logout:function(){
            return ApiService.rest(this.base+"/logout", {
                Session:{method:"GET", params:{}}
            });
        },
        check:function(){
            return ApiService.rest(this.base+"/check/?email=:email",{
                list:{method:"GET", params:{email: "@email"}}
            });
        }

    };
};