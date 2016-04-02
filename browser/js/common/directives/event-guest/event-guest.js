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

        let attendeeGuestArray = AttendeeEventFactory.arrayToModify("attendees/" + scope.attendeeid + "/events/" + scope.evtid);
        let guestId = scope.guest.$id;
        return attendeeGuestArray.$loaded()
        .then(function(data){
          console.log("DATA LENGTH", data.length)
          if(data.length <= 1){
            data.$ref().set("No guests")
            .then(function(data){
                console.log("NO GUESTS ASSIGNED: ", data);
            })
          } else if(data.length > 1){
            console.log("DATA: ", data)
            return data.$ref().child(guestId)
            .remove()
            .then(function(ref){
              console.log("GUEST REMOVED: ", ref);
              return AttendeeEventFactory.modifyEventGuestList(scope.evtid, scope.attendeeid).removeGuest(guestId);
            })
          }
          // if(attendeeGuestObj.hasOwnProperty(scope.guest.$id)){
          //   delete attendeeGuestObj[scope.guest.$id];
          //   return attendeeGuestObj.$save()
          //   .then(function(ref){
          //     AttendeeEventFactory.modifyEventGuestList(scope.evtid, scope.attendeeid).removeGuest(scope.guest.$id);
          //   })
          // }
        });
      }
    }
  }
})
