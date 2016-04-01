app.directive("addEventGuest", function(DatabaseFactory, $firebaseArray){
  return {
    restrict: "E",
    templateUrl: "/js/common/directives/add-event-guest/add-event-guest.html",
    scope: {
      attendee: "=",
      evt: "=",
      guestDetails: "@"
    },
    link: function(scope, element, attrs){

      let attendeeEventRef = DatabaseFactory.dbConnection("attendees/" + scope.attendee.$id + "/events/" + scope.evt.$id);

      let guestArray = $firebaseArray(attendeeEventRef);

      scope.addNewGuest = () => {
        console.log("GUEST DETAILS: ", scope.guestDetails);
        if(!scope.guestDetails){
          console.error("NO PLEASE FILL IN THE FORM!")

        } else {

          return guestArray.$add(scope.guestDetails.firstName + " " + scope.guestDetails.lastName)
          .then(function(ref){
            console.log("REFERNCE KEY: ", ref.key())
            console.log("REFERENCE VALUE: ", guestArray.$value(ref.key()));
          })
        }


      }
    }
  }
})
