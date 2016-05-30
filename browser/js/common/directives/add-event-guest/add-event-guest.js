app.directive("addEventGuest", function(AttendeeEventFactory, $firebaseArray, $rootScope){
  return {
    restrict: "E",
    templateUrl: "/js/common/directives/add-event-guest/add-event-guest.html",
    scope: {
      attendee: "=",
      evt: "=",
      available: "=",
      formreset: "="
    },
    link: function(scope, element, attrs){

      /* Set form validation values to pristine and untouched and null model values to prevent invalid view values remaining visible on the DOM. */
      var resetForm = function(){
        scope.guestEventForm.$setUntouched();
        scope.guestEventForm.$setPristine();
        scope.guestDetails = {firstName: null, lastName: null};
        return;
      }

      console.log("SEATS AVAILABLE: ", scope.available)
      /* Using firebase array to generate unique key for each guest. */
      let guestArray = AttendeeEventFactory.arrayToModify("attendees/" + scope.attendee.$id + "/events/" + scope.evt.$id)

      /* Add guest to eventGuestList once valid name is given */
      scope.addNewGuest = () => {
        let guestName = scope.guestDetails.firstName + " " + scope.guestDetails.lastName;
        return guestArray.$add(guestName)
        .then(function(ref){
          return AttendeeEventFactory.modifyEventGuestList(scope.evt.$id, scope.attendee).addGuest(ref.key(), guestName);
        })
        .then(function(data){
          resetForm();
        })
      }

      /* Watch for display form boolean value change, when it is closed, reset the form. */
      $rootScope.$watch(function() {
        return scope.formreset
      },
        function(newVal, oldVal){
        if(newVal === false){
          return resetForm();
        }

      })


    }
  }
})
