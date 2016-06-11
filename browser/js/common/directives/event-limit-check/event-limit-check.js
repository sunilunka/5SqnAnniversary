app.directive("eventLimitCheck", function($rootScope, EventFactory){
  return {
    restrict: "A",
    link: function(scope, element, attrs){
      /* When association is clicked, check that there are the seats available for that event.*/
      element.on("click", (e) => {
        /* If this is the first selection in the form, then toggle show events value. */
        let parentScope = scope.$parent;
        if(parentScope.hasOwnProperty("showEvents")){
          if(!parentScope.showEvents){
            parentScope.showEvents = true;
          }
        }
        scope.events = EventFactory.checkLimits(scope.events, attrs.value);
        $rootScope.$digest();
      })
    }
  }
})
