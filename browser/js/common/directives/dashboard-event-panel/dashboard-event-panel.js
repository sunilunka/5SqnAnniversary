app.directive("dashboardEventPanel", function(ParsingFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/dashboard-event-panel/dashboard-event-panel.html",
    scope: {
      evt: "=",
      categories: "="
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

      scope.$watch(function(){
        return scope.evt.guests
      }, function(newValue, oldValue){
        scope.totalAttendees = ParsingFactory.formatNumberForDisplay(getTotalGuests(newValue));
      })


    }
  }
})
