pydmFtry.CustomerService = function(ApiService){
    return {

        base:"customer",
        register:function(){
            return ApiService.rest(this.base,{
                create:{method:"POST", params:{}},
            });
        },
        pick:function(){
            return ApiService.rest(this.base+"/pick/:id?afterInitDate=:afterInitDate",{
                list:{method:"GET", params:{afterInitDate: "@afterInitDate"}},
                create:{method:"POST", params:{}},
                getByID:{method:"GET", params:{id:"@id"}},
                update:{method:"PUT", params:{id:"@id"}},
                delete:{method:"DELETE", params:{id:"@id"}}
            });
        },
        profile:function(){
            return ApiService.rest(this.base+"/profile",{
                list:{method:"GET", params:{}}              
            });
        },
        company:function(){
            return ApiService.rest(this.base+"/company",{
                list:{method:"GET", params:{}}              
            });
        },
        category: function(){
            return ApiService.rest(this.base+"/category",{
                list:{method:"GET", params:{}}              
            });
        }



    };
};
