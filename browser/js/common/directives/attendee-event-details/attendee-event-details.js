app.directive("attendeeEventDetails", function($rootScope, $timeout){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/attendee-event-details/attendee-event-details.html",
    scope: {},
    link: function(scope, element, attrs){

      scope.evt = {};

      $rootScope.$on("showEventDetails", function(event, detailsObj){
        angular.copy(detailsObj, scope.evt);
        element.addClass("show-details");
      })

      scope.closeEventView = function(){
        element.removeClass("show-details");
      }
    }
  }
})
