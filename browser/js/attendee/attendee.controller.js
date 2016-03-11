app.controller("AttendeeCtrl", function($scope, AuthService, AttendeeFactory, User, EventFactory, $state){

  $scope.user = User;

  $scope.eventsAttending = Object.keys(User.events);
  // $scope.details = AttendeeFactory.getOne();

  // $scope.details = UserDetails;
  $scope.removeFromEvent = (event, User) => {
    AttendeeFactory.removeEventFromAttendee(event, $scope.user)
    // EventFactory.removeAttendeeFromEvent(event, User.$id);
  }

})
