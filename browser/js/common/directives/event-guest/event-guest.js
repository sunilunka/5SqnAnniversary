app.directive("eventGuest", function(AttendeeEventFactory, NotificationService){
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
        NotificationService.notify("in-progress", "Removing guest...")
        let attendeeGuestArray = AttendeeEventFactory.arrayToModify("attendees/" + scope.attendee.$id + "/events/" + scope.evtid);
        let guestId = scope.guest.$id;
        return attendeeGuestArray.$loaded()
        .then(function(data){
          if(data.length <= 1){
            data.$ref().set("No guests")
            .then(function(data){
              return AttendeeEventFactory.modifyEventGuestList(scope.evtid, scope.attendee).removeGuest(guestId);
            })
            .then(function(data){
              NotificationService.notify("success", "Guest removed.")
            })
          } else if(data.length > 1){
            return data.$ref().child(guestId)
            .remove()
            .then(function(){
              return AttendeeEventFactory.modifyEventGuestList(scope.evtid, scope.attendeeid).removeGuest(guestId);
            })
            .then(function(data){
              NotificationService.notify("success", "Guest removed.")
            })
            .catch(function(error){
              NotificationService.notify("error", "SORRY AN ERROR OCCURED: " + error.message);
            })
          }
        });
      }
    }
  }
})
