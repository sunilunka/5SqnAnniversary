app.directive("eventLimitCheck", function($rootScope, EventFactory){
  return {
    restrict: "A",
    link: function(scope, element, attrs){
      /* When association is clicked, check that there are the seats available for that event. The EventFactory method will*/
      element.on("click", (e) => {
        scope.events = EventFactory.checkLimits(scope.events, attrs.value);
        $rootScope.$digest();
      })
    }
  }
})
