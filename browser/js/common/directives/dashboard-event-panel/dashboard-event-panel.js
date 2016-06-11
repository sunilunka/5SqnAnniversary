app.directive("dashboardEventPanel", function(ParsingFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/dashboard-event-panel/dashboard-event-panel.html",
    scope: {
      evt: "="
    },
    link: function(scope, element, attrs){

      var getTotalGuests = function(guestTotalObj){
        let total = 0;
        for(var value in guestTotalObj){
          total += guestTotalObj[value];
        }
        return total;
      }



      scope.totalAttendees = ParsingFactory.formatNumberForDisplay(getTotalGuests(scope.evt.guests));

      scope.displayStartTime = ParsingFactory.formatNumberObj(scope.evt.startTime);

      scope.displayEndTime = ParsingFactory.formatNumberObj(scope.evt.endTime);

      scope.$watch(function(){
        return scope.evt.guests;
      }, function(newValue, oldValue){
        if(newValue !== oldValue){
          scope.totalAttendees = ParsingFactory.formatNumberForDisplay(getTotalGuests(scope.evt.guests))
        }
      })
    }
  }
})
