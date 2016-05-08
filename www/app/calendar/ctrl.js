pydmCtrl.CalendarCtrl = function ($rootScope, $scope, $http, $stateParams, CustomerService, moment, calendarConfig, $ionicModal) {
	
	calendarConfig.dateFormatter = 'moment'; // use moment to format dates

  var vm = this;
  vm.events = [];
  $scope.vm=vm;

	$scope.getPicks = function(initDate, endDate){

		CustomerService.calendar().list({"initDate": initDate, "endDate": endDate}, {}, function(result){
	        var res = result;
	        console.log(res);
	        if (!res.error) {  
	            $scope.formatPicks(res.data[0].picks, "info");
              $scope.formatEvents(res.data[1].events, "warning");
	        }else{	        	
	           $scope.error=res.error;
	        }

	    }, function(){

	    });

	}

  //These variables MUST be set as a minimum for the calendar to work
  $scope.calendarView = 'month';
  $scope.currentView = 'month';
  $scope.viewDate = new Date();
  $scope.currentDate = new Date();
  $scope.picks = [];

  var startDate = moment($scope.currentDate).startOf('month');
  var endDate = moment(startDate).endOf('month');
  vm.events = [];
  $scope.getPicks(startDate.toDate(), endDate.toDate());

    $scope.formatPicks = function(picks, type){
   
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

    $scope.formatEvents = function(events, type){
   
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

     vm.cellModifier = function(cell) {
      //console.log(cell);
      if (cell.isPast) {
        cell.cssClass = 'past-cell';
      }
      cell.label = cell.label;
    };


    vm.lastDateClicked = "";
    vm.endDateEvent = "";

    vm.timespanClicked = function(date) {
      console.log(date);

      var obj = $(".cal-day-hour-part.activated");

      var aux = vm.events;
      var res = aux.filter(function (e) { 
        var d1 = new Date(e.startsAt);
        var d2 = new Date(date);
        var d3 = new Date(e.endsAt);
        return ( d1.getTime() === d2.getTime() || (d2 > d1 && d2 < d3)) && (e.type === "warning");
      });

      console.log(res);
 
      if(res.length > 0){
        console.log("No cabe");
        $(".cal-day-hour-part").removeClass("selected");
        $(".createEvent").remove();
      }else if($(obj).hasClass("selected")){
        vm.endDateEvent = vm.lastDateClicked;
        $scope.openModalEvent();
      }else{

        $(".cal-day-hour-part").removeClass("selected");
        $(obj).addClass("selected");
        $(".createEvent").remove();

        var html = "";
        html += "<div class='createEvent' id='newEvent'>Crear Evento</div>";

        $(obj).append(html);

        vm.lastDateClicked = date;

      }

    };

    $ionicModal.fromTemplateUrl('app/calendar/newEvent/main.html', {
        scope: $scope,
        animation: 'slide-in-right'
    }).then(function(modal) {
        $scope.modalEvent = modal;
    });

    $scope.openModalEvent = function() {
        $scope.modalEvent.show();
    };

    $scope.closeModalEvent = function() {
        $scope.modalEvent.hide();
        $("#eventName").val("");
    };


    $scope.error = "";

    $scope.newEvent = function(){
      //console.log("nuevo Evento");
      //console.log(vm.lastDateClicked);
      //console.log(vm.endDateEvent);

      var eventName = $("#eventName").val();

      var aux = vm.events;
      var res = aux.filter(function (e) { 
        var d1 = new Date(e.startsAt);
        var d2 = new Date(vm.lastDateClicked);
        var d3 = new Date(e.endsAt);
        var d4 = new Date(vm.endDateEvent);
        return ( (d1.getTime() === d2.getTime() || (d2 > d1 && d2 < d3)) || (d1.getTime() === d4.getTime() || (d4 > d1 && d4 < d3)) )
              && (e.type === "warning");
      });

      if(vm.endDateEvent < vm.lastDateClicked){
        $scope.error = "La fecha de fin debe ser mayor que la de inicio.";
      }else if(res.length > 0){
        $scope.error = "Los eventos no pueden solaparse.";
      }else if(eventName == ""){
        $scope.error = "El nombre no puede estar vacío.";
      }else{
        
        var endDate = vm.endDateEvent;

        if(vm.endDateEvent == vm.lastDateClicked)
          endDate = moment(vm.endDateEvent).add(10, 'minutes'); 

        var event = {
          "initDate" : new Date(vm.lastDateClicked), 
          "endDate" : new Date(endDate),
          "name": eventName,
          "description" : ""     
        }

        CustomerService.event().create({}, event , function(result){
          var res = result;

          if (!res.error) {     
            $scope.error = "";

            var obj = {
              title : eventName,
              type : "warning",
              startsAt : moment(vm.lastDateClicked).toDate(),
              endsAt : moment(endDate).toDate(),
              cssClass: 'my-custom-class'
            };
            vm.events.push(obj);

            $(".cal-day-hour-part").removeClass("selected");
            $(".createEvent").remove();

            $scope.closeModalEvent();

          } else {
            $scope.error = res.error;
          }
        }, function(){

        });

      }
      
    }

    $scope.datePickerCallback = function (val) {
      if (!val) { 
        console.log('Date not selected');
      } else {
        console.log('Selected date is : ', val);
        vm.lastDateClicked = val;
      }
    };

    $scope.fecha = "";
    $scope.fechaEnd = "";

    $scope.onTimeSet = function (newDate, oldDate) {
      $scope.fecha = newDate;
    }

    $scope.onTimeSet2 = function (newDate, oldDate) {
      $scope.fechaEnd = newDate;
    }

    //CAMBIO DE MES
    vm.viewChangeClicked = function(date, nextView) {

      $scope.currentView = nextView;
      $scope.currentDate = date;

      $scope.sendDates();

      return vm.viewChangeEnabled;
    };

    $(".button.month").on("click", function(){
        $scope.currentView = 'month';
        $scope.sendDates();
    });

    $(".button.day").on("click", function(){
        $scope.currentView = 'day';
        $scope.sendDates();
    });

    $(".button.ion-ios-arrow-right").on("click", function(){
        $scope.currentDate = moment($scope.currentDate).add(1, $scope.currentView).toDate();
        $scope.sendDates();
    });

    $(".button.ion-ios-arrow-left").on("click", function(){
        $scope.currentDate = moment($scope.currentDate).subtract(1, $scope.currentView).toDate();
        $scope.sendDates();
    });

    $(".button.today").on("click", function(){
        $scope.currentDate = new Date();
        $scope.sendDates();
    })

    $scope.sendDates = function(){
        var startDate = moment($scope.currentDate).startOf($scope.currentView);
        var endDate = moment(startDate).endOf($scope.currentView);
        vm.events = [];
        $scope.getPicks(startDate.toDate(), endDate.toDate());
        console.log(startDate.toDate() + "," + endDate.toDate());
    }

    $ionicModal.fromTemplateUrl('app/dashboard/pickDetail/main.html', {
        scope: $scope,
        animation: 'slide-in-right'
    }).then(function(modal) {
        $scope.modalPick = modal;
    });

    $scope.openPickDetail = function() {
        $scope.modalPick.show();
    };

    $scope.closePickDetail = function() {
        $scope.modalPick.hide();
    };

    $scope.currentPick = [];

    vm.eventClicked = function(event) {

      if($scope.currentView == "day" && event.type == "info"){

          CustomerService.pick().getByID({"id": event.cssClass}, {}, function(result){
              var res = result;
              console.log("PIICK");
              console.log(res);
              if (!res.error) {  
                  $scope.currentPick = res.data;
                  $scope.openPickDetail();
              }else{            
                 $scope.openModal(res.error);
              }

          }, function(){

          });
      }
      console.log(event);
    };
    
}
