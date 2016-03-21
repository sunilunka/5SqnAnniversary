app.directive("attendeeEvent", function(AttendeeFactory){
  return {
    restrict: "E",
    templateUrl: "/js/common/directives/attendee-event/attendee-event.html",
    scope: {
      evt: "=",
      attendee: "="
    },
    link: function(scope, element, attrs){
      scope.removeFromEvent = (evtId) => {
        AttendeeFactory.removeEventFromAttendee(evtId, scope.attendee);
      }

      scope.attendEvent = (evtId) => {
        AttendeeFactory.addEventToAttendee(evtId, scope.attendee)
        .then(function(ref){
          console.log("USER ADDED TO EVENT")
        })
      }
    }
  }
})
