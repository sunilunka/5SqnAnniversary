app.directive("eventLimitCheck", function($rootScope, EventFactory){
  return {
    restrict: "A",
    link: function(scope, element, attrs){

      element.on("click", (e) => {
        scope.events = EventFactory.checkLimits(scope.events, attrs.value);
        $rootScope.$digest();
      })
    }
  }
})
