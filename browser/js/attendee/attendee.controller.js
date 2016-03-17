app.controller("AttendeeCtrl", function($scope, AuthService, AttendeeFactory, User, Events, EventFactory, $state){

  /* Add additional parameters to the events array to facilitate indication of the user attending or not. */
  var userEventList = (eventsArray) => {
    let userEvents = Object.keys(User.events);
    return eventsArray.map(function(singleEvt){
      let arrayEvent = singleEvt.$id;
      if(userEvents.indexOf(arrayEvent) > -1){
        singleEvt["attending"] = true;
      }
      return singleEvt;
    })

  }

  $scope.user = User;

  $scope.events = userEventList(Events);

  // $scope.details = AttendeeFactory.getOne();

  // $scope.details = UserDetails;
  $scope.removeFromEvent = (event, User) => {
    AttendeeFactory.removeEventFromAttendee(event, $scope.user)
    // EventFactory.removeAttendeeFromEvent(event, User.$id);
  }

})
