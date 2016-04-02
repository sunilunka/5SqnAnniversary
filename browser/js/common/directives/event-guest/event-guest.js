app.directive("eventGuest", function(AttendeeEventFactory){
  return {
    restrict: "E",
    templateUrl: "/js/common/directives/event-guest/event-guest.html",
    scope: {
      attendeeid: "@",
      evtid: "@",
      guest: "="
    },
    link: function(scope, element, attrs){
      scope.removeGuest = () => {
        console.log("ATTENDEE ID: ", scope.attendeeid)
        console.log("EVENT ID: ", scope.evtid);
        let attendeeGuestObj = AttendeeEventFactory.objectToModify("attendees/" + scope.attendeeid + "/events/" + scope.evtid);
        let guestId = scope.guest.$id;
        return attendeeGuestObj.$loaded()
        .then(function(data){
          if(attendeeGuestObj.hasOwnProperty(scope.guest.$id)){
            delete attendeeGuestObj[scope.guest.$id];
            return attendeeGuestObj.$save()
            .then(function(ref){
              AttendeeEventFactory.modifyEventGuestList(scope.evtid, scope.attendeeid).removeGuest(scope.guest.$id);
            })
          }
        });
      }
    }
  }
})
