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
	            $scope.formatEvents(res.data[0].picks);
	        } else {	        	
	           $scope.error=res.error;
	        }

	    }, function(){

	    });

	}


	$scope.getPicks();
	

    //These variables MUST be set as a minimum for the calendar to work
    $scope.calendarView = 'month';
    $scope.viewDate = new Date();
    $scope.picks = [];


    $scope.formatEvents = function(picks){
   
    	picks.forEach(function(pick){
      		var obj = {
      			title : pick.pick.service.metadata.name,
      			type : "info",
      			startsAt : moment(pick.init).toDate(),
      			endsAt : moment(pick.end).toDate(),
            cssClass: 'my-custom-class'
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
        $scope.openModal();
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
        $scope.modal = modal;
    });

    $scope.openModal = function() {
        $scope.modal.show();
    };

    $scope.closeModal = function() {
        $scope.modal.hide();
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
        $scope.error = "";

        if(vm.endDateEvent == vm.lastDateClicked)
          vm.endDateEvent = moment(vm.endDateEvent).add(10, 'minutes'); 

        var obj = {
          title : eventName,
          type : "warning",
          startsAt : moment(vm.lastDateClicked).toDate(),
          endsAt : moment(vm.endDateEvent).toDate(),
          cssClass: 'my-custom-class'
        };
        vm.events.push(obj);

        $(".cal-day-hour-part").removeClass("selected");
        $(".createEvent").remove();

        $scope.closeModal();
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
    
    /*vm.events = [
      {
        title: 'Cortar el pelo',
        type: 'warning',
        startsAt: moment().startOf('day').add(7, 'hours').toDate(),
        endsAt: moment().startOf('day').add(9, 'hours').toDate()
      }, {
        title: 'Comida de empresa',
        type: 'info',
        startsAt: moment().startOf('day').add(10, 'hours').toDate(),
        endsAt: moment().startOf('day').add(16, 'hours').toDate()
      },
      {
        title: 'Cambio de aceite',
        type: 'important',
        startsAt: moment().startOf('day').add(1, 'day').add(10, 'hours').toDate(),
        endsAt: moment().startOf('day').add(1, 'day').add(16, 'hours').toDate()
      },
      {
        title: 'Cambio de aceite',
        type: 'warning',
        startsAt: moment().startOf('day').add(3, 'day').add(6, 'hours').toDate(),
        endsAt: moment().startOf('day').add(3, 'day').add(10, 'hours').toDate()
      },
      {
        title: 'Cambio de aceite',
        type: 'info',
        startsAt: moment().startOf('day').add(6, 'day').add(10, 'hours').toDate(),
        endsAt: moment().startOf('day').add(6, 'day').add(16, 'hours').toDate()
      }
    ]; */
    //console.log($scope.events);

    //$scope.isCellOpen = true;
    /*
    $scope.eventClicked = function(event) {
      alert.show('Clicked', event);
    };

    $scope.eventEdited = function(event) {
      alert.show('Edited', event);
    };

    $scope.eventDeleted = function(event) {
      alert.show('Deleted', event);
    };

    $scope.eventTimesChanged = function(event) {
      alert.show('Dropped or resized', event);
    };*/
/*
    $scope.toggle = function($event, field, event) {
      $event.preventDefault();
      $event.stopPropagation();
      event[field] = !event[field];
    };
*/
/*
     $scope.$on('$destroy', function() {
      calendarConfig.templates.calendarMonthCell = 'mwl/calendarMonthCell.html';
    });
    */
    

}
