app.directive("addEventGuest", function(AttendeeEventFactory, $firebaseArray){
  return {
    restrict: "E",
    templateUrl: "/js/common/directives/add-event-guest/add-event-guest.html",
    scope: {
      attendee: "=",
      evt: "=",
      guestDetails: "@",
      available: "="
    },
    link: function(scope, element, attrs){


      console.log("SEATS AVAILABLE: ", scope.available)
      /* Using firebase array to generate unique key for each guest. */
      let guestArray = AttendeeEventFactory.arrayToModify("attendees/" + scope.attendee.$id + "/events/" + scope.evt.$id)

      scope.addNewGuest = () => {
        if(!scope.guestDetails){
          console.error("PLEASE FILL IN THE FORM!")

        } else {
          let guestName = scope.guestDetails.firstName + " " + scope.guestDetails.lastName;
          return guestArray.$add(guestName)
          .then(function(ref){
            return AttendeeEventFactory.modifyEventGuestList(scope.evt.$id, scope.attendee).addGuest(ref.key(), guestName);
          })
          .then(function(data){
            scope.guestDetails = {};
          })
        }


      }
      console.log("REGISTER FORM: ", scope.guestEvent);
    }
  }
})
