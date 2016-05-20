pydmCtrl.NewPickCtrl = function ($rootScope, $scope, $http, $stateParams,$ionicHistory, CustomerService, calendarConfig, $ionicPopup, $ionicLoading, $ionicScrollDelegate) {
	
	var idCompany = $stateParams.company;
	var idService = $stateParams.service;
	//console.log(idCompany);
	//console.log(idService);

	$scope.company = [];
	$scope.service = [];

	$scope.idCompany = idCompany;
	$scope.idService = idService;

	$scope.date = new Date();


	$scope.currentDate = new Date();
	$scope.minDate = new Date();
	$scope.maxDate = new Date(2100, 6, 31);

	$scope.fecha = new Date();

	$scope.getCompany = function(){
		CustomerService.company().getByID({"id": $scope.idCompany}, {}, function(result){
	        var res = result;
	        //console.log(result);
	        if (!res.error) {       
	            $scope.company = res.data;    
	        } else {
	           $scope.error=res.error;
	        }
	    }, function(){

	    });
	}

	$scope.getService = function(){
		CustomerService.service().getByID({"id": $scope.idService, "company": $scope.idCompany }, {}, function(result){
	        var res = result;
	        //console.log(result);
	        if (!res.error) {       
	            $scope.service = res.data;    
	            console.log($scope.service);
	        } else {
	           $scope.error=res.error;
	        }
	    }, function(){

	    });
	}

	$scope.getCompany();
	$scope.getService();

	$scope.datePickerCallback = function (val) {
		if (!val) {	
			//console.log('Date not selected');
		} else {
			//console.log('Selected date is : ', val);
			$scope.date = val;
		}
	};

	$scope.activatePick = function(id){

		CustomerService.activePick().active({"id":id}, {} , function(result){
			var res = result;
			if (!res.error) {								
				$rootScope.go("app.dashboard");
				console.log(res);
			} else {
				$scope.error=res.error;
				$scope.openModal($scope.error.message);
			}

        }, function(){

        });
	}

	$scope.deletePick = function(id){

		CustomerService.pick().delete({"id":id}, {} , function(result){
			var res = result;
			if (!res.error) {								
				console.log("eliminado correctamente");
			} else {
				$scope.error=res.error;
				$scope.openModal($scope.error.message);
			}

        }, function(){

        });
	}

	$scope.newPick = function (obj) {

		if (obj) {

			var obj = {
				"initDate" : new Date(obj.startsAt),
				"origin" : "mobile",
				"company": {
					"id_company": $scope.idCompany,
					"id_service": $scope.idService
				},
				"resource": obj.title
			}
			
			CustomerService.pick().create({}, obj , function(result){
				var res = result;
				console.log(res);
				if (!res.error) {		
					var date = new Date(obj.initDate);
					var objData = {
						"service" : $scope.service.id_name.name,
						"company": $scope.company.name,
						"date":  moment(date).format('DD/MM/YYYY HH:mm'),
						"id": res.data._id
					} 
					$scope.showConfirm(objData);
				} else {
					$scope.error=res.error;
					$scope.openModal($scope.error.message);
				}

            }, function(){

            });

		}

	}

	$scope.showConfirm = function(obj) {

		var html  = "¿Deseas crear el siguiente pick?<br>";
		html += obj.service + "<br>";
		html += obj.company + "<br>";
		html += obj.date;

	   var confirmPopup = $ionicPopup.confirm({
	     title: 'Crear Pick',
	     template: html
	   });

	   confirmPopup.then(function(res) {
	     if(res) {
	       $scope.activatePick(obj.id);
	     }else {
	     	$scope.deletePick(obj.id);
	       console.log('Delete pick');
	     }
	   });

	 };

	$scope.$on('$ionicView.enter', function() {
		var back = $ionicHistory.backView().stateName;
		if(back != "app.companiesDetail")
    		$rootScope.go("app.dashboard");
	});


	$scope.beforeRender = function ($view, $dates, $leftDate, $upDate, $rightDate) {

	    var threeMonthsLater = moment().add(3, 'years');
	    for(var i=0; i<$dates.length;i++) {
	       if(moment().subtract(1, 'days') > $dates[i].utcDateValue && $dates[i].utcDateValue < threeMonthsLater ) {
	          $dates[i].selectable = false;
	       }
	    }     
	}

	/*
	$scope.beforeRender = function ($view, $dates, $leftDate, $upDate, $rightDate) {
        var threeMonthsLater = moment().add(3, 'months');
        for(var index=0;index<$dates.length;index++) {
            $dates[index].selectable = moment($dates[index].utcDateValue).isBetween(moment(),threeMonthsLater);            
        }
    }
    */

	$scope.onTimeSet = function (newDate, oldDate) {
		$scope.fecha = newDate;
	    //console.log(newDate);
	    //console.log(oldDate);
	}

	$scope.showLoading = function() {
		$ionicLoading.show({
			template: 'Cargando...'
		});
	};

	$scope.hideLoading = function(){
		$ionicLoading.hide();
	};

	//CALENDARIO
	calendarConfig.dateFormatter = 'moment'; // use moment to format dates

	var vm = this;
	vm.events = [];
	$scope.vm=vm;

	$scope.calendarView = 'month';
  	$scope.currentView = 'month';
  	$scope.viewDate = new Date();
  	$scope.currentDate = new Date();

  	$scope.getPicks = function(initDate, endDate){

  		$scope.showLoading();

		CustomerService.calendar().list({"initDate": initDate, "endDate": endDate, "service": $scope.idService, "company": $scope.idCompany}, {}, function(result){
	        var res = result;
	        //console.log(res);
	        if (!res.error) {  
	           	$scope.formatPicks(res.data[0].picks, "info");
              	$scope.formatEvents(res.data[1].events, "warning");
              	$.when($scope.formatAvailables(res.data[2].availables, "important")).then(function( x ) {
				 setTimeout(function(){
				 	$scope.hideLoading();
				 },200);
				});
	        }else{	        	
	        	$scope.hideLoading();
	          	$scope.error=res.error;
	          	$scope.openModal(res.error);
	        }

	    }, function(){

	    });

	}

	$scope.formatPicks = function(picks, type){
   		
   		var aux = vm.events;
    	var res = aux.filter(function (e) { 	      
	        return (e.type === "info");
	    });
   		
   		if(res.length == 0){
	    	picks.forEach(function(pick){
	      		var obj = {
	      			title : pick.pick.service.metadata.name,
	      			type : type,
	      			startsAt : moment(pick.init).toDate(),
	      			endsAt : moment(pick.end).toDate(),
	            cssClass: pick.pick._id
	      		};
	      		vm.events.push(obj);
	  		}); 
	    }
    }

    $scope.formatEvents = function(events, type){

    	var aux = vm.events;
    	var res = aux.filter(function (e) { 	      
	        return (e.type === "warning");
	    });
   		
   		if(res.length == 0){
	      events.forEach(function(event){
	          var obj = {
	            title : event.name,
	            type : type,
	            startsAt : moment(event.initDate).toDate(),
	            endsAt : moment(event.endDate).toDate(),
	            cssClass: event._id
	          };
	          vm.events.push(obj);
	      }); 
	  }
    }


    $scope.formatAvailables = function(availables, type){
   
      availables.forEach(function(available){
          var obj = {
            title : available.resource,
            type : type,
            startsAt : moment(available.initDate).toDate(),
            endsAt : moment(available.endDate).toDate(),
            cssClass: "available"
          };
          vm.events.push(obj);          
      }); 
      //console.log(vm.events);
    }


    vm.cellModifier = function(cell) {
      //console.log(cell);

      var res = cell.events.filter(function (e) { 
        return (e.type === "important");
      });

      if(res.length > 0){
      	cell.cssClass = 'available';
      }else{
      	cell.cssClass = 'no-available';
      }

      cell.label = cell.label;
    };


    vm.lastDateClicked = "";

    vm.timespanClicked = function(date) {
      //console.log(date);

    	var obj = $(".cal-day-hour-part.activated");

    	var aux = vm.events;
    	var res = aux.filter(function (e) { 
	        var d1 = new Date(e.startsAt);
	        var d2 = new Date(date);
	        var d3 = new Date(e.endsAt);
	        return ( d1.getTime() === d2.getTime() || (d2 > d1 && d2 < d3)) && (e.type === "important");
	    });

      //console.log(res);
 
      if($(obj).hasClass("selected")){
        //console.log("new pick");
        if(res.length > 0)
        	$scope.newPick(res[0]);
      }else if(res.length > 0){
        //console.log("Bieen");
        $(".cal-day-hour-part").removeClass("selected");
        $(obj).addClass("selected");
        $(".createPick").remove();

        var hora = moment(res[0].startsAt).format('HH:mm');
        var html = "";
        html += "<div class='createPick' id='createPick'>Hacer pick - "+ hora +"</div>";

        $(obj).append(html);

        vm.lastDateClicked = date;
      }

    };

    $("#createPick").on("click", function(){
    	//console.log(this);
    	console.log("pick click");
    })
   


	$scope.currentDate = new Date();
	var startDate = moment($scope.currentDate).startOf('month');
  	var endDate = moment(startDate).endOf('month');
  	$scope.getPicks(startDate.toDate(), endDate.toDate());

	
  	//CAMBIO DE MES
    vm.viewChangeClicked = function(date, nextView) {

      var month = moment($scope.currentDate).month();
      $scope.currentView = nextView;
      $scope.currentDate = date;

      var month2 = moment($scope.currentDate).month();

      if(month != month2)
        $scope.sendDates();

      return vm.viewChangeEnabled;
    };

    $(".button.month").on("click", function(){
        $scope.currentView = 'month';
        //$scope.sendDates();
    });

    $(".button.day").on("click", function(){
        $scope.currentView = 'day';
        //$scope.sendDates();
    });

    $(".button.ion-ios-arrow-right").on("click", function(){
    	var month = moment($scope.currentDate).month();
        $scope.currentDate = moment($scope.currentDate).add(1, $scope.currentView).toDate();
        var month2 = moment($scope.currentDate).month();

        if(month != month2)
        	$scope.sendDates();
    });

    $(".button.ion-ios-arrow-left").on("click", function(){
    	var month = moment($scope.currentDate).month();
        $scope.currentDate = moment($scope.currentDate).subtract(1, $scope.currentView).toDate();
        var month2 = moment($scope.currentDate).month();

        if(month != month2)
        	$scope.sendDates();
    });

    $(".button.today").on("click", function(){
    	var month = moment($scope.currentDate).month();
        $scope.currentDate = new Date();
        var month2 = moment($scope.currentDate).month();

        if(month != month2)
       	 $scope.sendDates();
    })

    $scope.sendDates = function(){
        var startDate = moment($scope.currentDate).startOf($scope.currentView);
        var endDate = moment(startDate).endOf($scope.currentView);



        if($scope.currentView == "month"){
       		vm.events = [];
        }

        $scope.getPicks(startDate.toDate(), endDate.toDate());
       // console.log(startDate.toDate() + "," + endDate.toDate());
    }

	$scope.getScrollPosition = function(){
		var st = $ionicScrollDelegate.getScrollPosition().top;
    	if(st > 160){
    		var date = $(".newPick .text-center").html();
    		$(".date-on-scroll .date").html(date);
    		$(".date-on-scroll").addClass("active");	    		
    	}else{
    		$(".date-on-scroll").removeClass("active");	
    	}
    }


}