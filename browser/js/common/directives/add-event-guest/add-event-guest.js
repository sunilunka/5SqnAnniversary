app.directive("addEventGuest", function(){
  return {
    restrict: "E",
    templateUrl: "/js/common/directives/add-event-guest/add-event-guest.html",
    scope: {
      attendee: "=",
      evt: "="
    },
    link: function(scope, element, attrs){
      scope.addNewGuest = () => {
        console.log("ADDING NEW GUEST: ", scope.guestDetails)
      }
    }
  }
})
