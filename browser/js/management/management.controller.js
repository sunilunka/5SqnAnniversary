app.controller('ManagementCtrl', function($scope, EventFactory, attendees, dinnerAttendees){
  $scope.attendees = attendees

  $scope.dinnerAttendees = dinnerAttendees;

  $scope.submitNewEvent = () => {
    return EventFactory.addEvent($scope.eventName);
  }
})
