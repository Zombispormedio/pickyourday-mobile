pydmFtry.CustomerService = function(ApiService){
    return {

        base:"customer",
        pick:function(){
            return ApiService.rest(this.base+"/pick/:id",{
                list:{method:"GET", params:{}},
                create:{method:"POST", params:{}},
                getByID:{method:"GET", params:{id:"@id"}},
                update:{method:"PUT", params:{id:"@id"}},
                delete:{method:"DELETE", params:{id:"@id"}}
            });
        }


    };
};
