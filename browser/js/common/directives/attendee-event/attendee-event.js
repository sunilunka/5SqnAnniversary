app.directive("attendeeEvent", function(AttendeeFactory, DatabaseFactory, $firebaseArray){
  return {
    restrict: "E",
    templateUrl: "/js/common/directives/attendee-event/attendee-event.html",
    scope: {
      evt: "=",
      attendee: "="
    },
    link: function(scope, element, attrs){

      /* Get array of guests who the attendee intends to bring. */
      let attendeeEventRef = DatabaseFactory.dbConnection("attendees/" + scope.attendee.$id + "/events");
      attendeeEventRef.on("value", function(snapshot){
        if(snapshot.hasChild(scope.evt.$id)){
          let guests = $firebaseArray(attendeeEventRef.child(scope.evt.$id));
          guests.$loaded()
          .then(function(data){
            scope.guests = data;
          })
        }
      });
      /* Value used to modify UI with respect to user attending an event or not. */
      scope.attending = false;

      scope.guests;

      /* Compare all events with events user has signed up with. This facilitates UI configuration and options for each event */
      scope.isUserAttending = (evt) => {
        if(!scope.attendee.hasOwnProperty("events")){
          scope.attending = false;
          return;
        }
        let userEvents = Object.keys(scope.attendee.events);
        /* If user has toggled the initial login form checkbox, the event key will be added to the event list. However, the value will be false. Hence, the && requirement, facilitate correct UI rendering. */
        if(userEvents.indexOf(evt.$id) > -1 && scope.attendee.events[evt.$id]){
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

      /* Add attendee to event guestList, and also add entry to attendee datastore */
      scope.attendEvent = (evtId) => {
        AttendeeFactory.addEventToAttendee(evtId, scope.attendee)
        .then(function(ref){
          scope.isUserAttending(scope.evt);
        })
      }
    }
  }
})
