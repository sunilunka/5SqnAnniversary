app.directive("newAttendeeExternalForm", function(FormValidityFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/new-attendee-external-form/new-attendee-external-form.html",
    scope: {
      events: "=",
      categories: "="
    },
    link: function(scope, element, attrs){
;
      scope.showEvents = false;
      scope.eventsError = false;
      scope.newAttendeeData = {};

      scope.saveAttendee = function(){
        console.log("REGISTER: ", scope.register);
        console.log("NEW-ATTENDEE-DATA: ", scope.newAttendeeData)
        if(FormValidityFactory.checkEvents(scope.newAttendeeData)){
          scope.eventsError = false;
        } else {
          scope.eventsError = true;
        }
      }
    }
  }

})
