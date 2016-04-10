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
            return ApiService.rest(this.base+"/company/:id",{
                list:{method:"GET", params:{}},
                getByID:{method:"GET", params:{id:"@id"}}
            });
        },
        service:function(){
            return ApiService.rest(this.base+"/service/:id/:company",{
                getByID:{method:"GET", params:{id:"@id", company: "@company"}}
            });
        },
        category: function(){
            return ApiService.rest(this.base+"/category/:id",{
                getByID:{method:"GET", params:{id:"@id"}},
                list:{method:"GET", params:{}}              
            });
        },
        preferences:function(){
            return ApiService.rest(this.base+"/preferences", {
                list:{method:"GET", params:{}},
                save:{method:"POST", params:{}}
            });
        },
        search:function(){
            return ApiService.rest(this.base+"/search",{
                list:{method:"GET", params:{}}
            });
        },
        calendar:function(){
            return ApiService.rest(this.base+"/timeLine/?initDate=:initDate&endDate=:endDate",{
                list:{method:"GET", params:{initDate: "@initDate", endDate: "@endDate"}}
            });
        }



    };
};
