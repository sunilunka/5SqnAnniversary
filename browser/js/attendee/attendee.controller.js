app.controller("AttendeeCtrl", function($scope, AuthService, AttendeeFactory, User, Events, EventFactory, $state){

  /* Add additional parameters to the events array to facilitate indication of the user attending or not. This is for UI rendering purposes */
  var userEventList = (eventsArray) => {
    /* If user is not attending any events, then return the events array. This presents the option to the user to select an event to attend */
    if(!User.hasOwnProperty("events")) return Events;
    /* If the user is attending events, then modify array with property that allows modification of UI to indicate attendance or not */
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

  // $scope.removeFromEvent = (evtId) => {
  //   AttendeeFactory.removeEventFromAttendee(evtId, $scope.user);
  // }
  //
  // $scope.attendEvent = (evtId) => {
  //   AttendeeFactory.addEventToAttendee(evtId, $scope.user)
  //   .then(function(ref){
  //     $scope.events = userEventList(Events)
  //   })
  // }

})
