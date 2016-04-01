app.directive("eventGuest", function(){
  return {
    restrict: "E",
    templateUrl: "/js/common/directives/event-guest/event-guest.html",
    scope: {
      attendee: "=",
      evt: "=",
      guest: "="
    },
    link: function(scope, element, attrs){
      scope.removeGuest = () => {
        console.log("ATTENDEE: ", scope.attendee);
        console.log("EVENT GUEST: ", scope.guest);
        console.log("EVENT: ", scope.evt)
      }
    }
  }
})
