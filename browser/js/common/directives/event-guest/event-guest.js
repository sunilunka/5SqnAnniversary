app.directive("eventGuest", function(AttendeeEventFactory){
  return {
    restrict: "E",
    templateUrl: "/js/common/directives/event-guest/event-guest.html",
    scope: {
      attendee: "=",
      evtid: "@",
      guest: "="
    },
    link: function(scope, element, attrs){
      scope.removeGuest = () => {

        let attendeeGuestArray = AttendeeEventFactory.arrayToModify("attendees/" + scope.attendee.$id + "/events/" + scope.evtid);
        let guestId = scope.guest.$id;
        return attendeeGuestArray.$loaded()
        .then(function(data){
          console.log("DATA LENGTH", data.length)
          if(data.length <= 1){
            data.$ref().set("No guests")
            .then(function(data){
              return AttendeeEventFactory.modifyEventGuestList(scope.evtid, scope.attendee).removeGuest(guestId);
            })
          } else if(data.length > 1){
            return data.$ref().child(guestId)
            .remove()
            .then(function(){
              return AttendeeEventFactory.modifyEventGuestList(scope.evtid, scope.attendeeid).removeGuest(guestId);
            })
            .catch(function(error){
              console.log("SORRY AN ERROR OCCURED: ", error);
            })
          }
        });
      }
    }
  }
})
