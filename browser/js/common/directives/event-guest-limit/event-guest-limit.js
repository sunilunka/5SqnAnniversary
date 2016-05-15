app.directive("eventGuestLimit", function(EventFactory){
  return {
    restrict: "E",
    templateUrl: "/js/common/directives/event-guest-limit/event-guest-limit.html",
    scope: {
      evt: "=",
      cats: "="
    },
    link: function(scope, element, attrs){
      /* Instantiate blank object for form values. */


      scope.limits = scope.evt.guestLimits || {};

      console.log("LIMITS: ", scope.limits);
      scope.saveGuestLimits = () => {
        EventFactory.addLimitsToEvent(scope.evt.$id, scope.limits);

      }
    }
  }

})
