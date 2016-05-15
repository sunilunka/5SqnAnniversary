app.directive("eventLimitCheck", function(EventFactory){
  return {
    restrict: "A",
    link: function(scope, element, attrs){

      let runAvailabilityScan = () => {
        
      }

      scope.placesAvailable = true;

      element.on("click", (e) => {
        scope.events = () => {
          EventFactory.checkLimits(scope.events, attrs.value);
          $rootScope.$digest();
        }

      })
    }
  }
})
