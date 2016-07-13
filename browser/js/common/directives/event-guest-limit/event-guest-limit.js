app.directive("eventGuestLimit", function(EventFactory, $rootScope){
  return {
    restrict: "E",
    templateUrl: "/js/common/directives/event-guest-limit/event-guest-limit.html",
    scope: {
      evt: "=",
      cats: "="
    },
    link: function(scope, element, attrs){
      /* Instantiate blank object for form values. */
      scope.limits = {};

      /* Make copy of original object to allow cancelling. */
      angular.copy(scope.evt.guestLimits, scope.limits);

      scope.saveGuestLimits = () => {
        EventFactory.addLimitsToEvent(scope.evt.$id, scope.limits)
        .then(function(limitObj){
          scope.$parent.toggleGuestLimits();
          /* Rootscope $digest required to allow the parent scope to process the changed values on it's scope. */
          $rootScope.$digest();
        })
        .catch(function(error){
          console.error("SORRY AN ERROR OCCURED: ", error);
        })

      }

      scope.cancelEdit = (event) => {
        event.preventDefault();
        angular.copy(scope.evt.guestLimits, scope.limits);
        scope.$parent.toggleGuestLimits();
      }
    }
  }

})
