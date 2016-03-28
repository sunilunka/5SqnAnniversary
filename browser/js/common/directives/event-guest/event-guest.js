app.directive("eventGuest", function(){
  return {
    restrict: "E",
    templateUrl: "/js/common/directives/event-guest/event-guest.html",
    scope: {
      attendee: "=",
      evt: "="
    },
    link: function(scope, element, attrs){
      scope.removeGuest = () => {
        console.log("ATTENDEE: ", scope.attendee);
      }
    }
  }
})
