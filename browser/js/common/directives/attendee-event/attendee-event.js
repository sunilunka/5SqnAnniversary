app.directive("attendeeEvent", function(AttendeeFactory, DatabaseFactory){
  return {
    restrict: "E",
    templateUrl: "/js/common/directives/attendee-event/attendee-event.html",
    scope: {
      evt: "=",
      attendee: "="
    },
    link: function(scope, element, attrs){
      /* Value used to modify UI with respect to user attending an event or not. */
      scope.attending = false;


      scope.guests = false;
      scope.addingGuests = true;

      /* Compare all events with events user has signed up with. This facilitates UI configuration and options for each event */
      scope.isUserAttending = (evt) => {
        let userEvents = Object.keys(scope.attendee.events);
        if(userEvents.indexOf(evt.$id) > -1){
          scope.attending = true;
        } else {
          scope.attending = false;
        }
      }

      /* As each event is loading determine if user is attending or not. */
      scope.isUserAttending(scope.evt);


      scope.removeFromEvent = (evtId) => {
        AttendeeFactory.removeEventFromAttendee(evtId, scope.attendee)
        .then(function(ref){
          scope.isUserAttending(scope.evt);
        })
      }

      scope.attendEvent = (evtId) => {
        AttendeeFactory.addEventToAttendee(evtId, scope.attendee)
        .then(function(ref){
          scope.isUserAttending(scope.evt);
        })
      }

      /* Function to run factory method */
      scope.removeGuestFromEvent = (attendee, evtId) => {
          AttendeeFactory.attendeeGetEventGuests(attendee, evtId);

      }
    }
  }
})
