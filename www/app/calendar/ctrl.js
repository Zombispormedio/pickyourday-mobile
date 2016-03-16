pydmCtrl.CalendarCtrl = function ($rootScope, $scope, $http, $stateParams, CustomerService, moment, calendarConfig) {
	
	//calendarConfig.templates.calendarMonthCell = 'customMonthCell.html';
	calendarConfig.dateFormatter = 'moment'; // use moment to format dates

    //These variables MUST be set as a minimum for the calendar to work
    $scope.calendarView = 'month';
    $scope.viewDate = new Date();
    $scope.events = [
      {
        title: 'Cortar el pelo',
        type: 'warning',
        startsAt: moment().startOf('day').add(7, 'hours').toDate(),
        endsAt: moment().startOf('day').add(9, 'hours').toDate()
        //draggable: true,
        //resizable: true
      }, {
        title: 'Comida de empresa',
        type: 'info',
        startsAt: moment().startOf('day').add(10, 'hours').toDate(),
        endsAt: moment().startOf('day').add(16, 'hours').toDate()
       // draggable: true,
        //resizable: true
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
      /*, {
        title: 'This is a really long event title that occurs on every year',
        type: 'important',
        startsAt: moment().startOf('day').add(7, 'hours').toDate(),
        endsAt: moment().startOf('day').add(19, 'hours').toDate(),
        recursOn: 'year',
        //draggable: true,
        //resizable: true
      }*/
    ];

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
