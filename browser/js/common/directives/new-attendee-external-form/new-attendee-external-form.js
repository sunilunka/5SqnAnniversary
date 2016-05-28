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
          /*
            => To Implement, is the save portion. Will be done once the updated SDK is implemented.
          */
        } else {
          /* If the check for events is false, then return, as the user has not entered in any events to attend. */
          scope.eventsError = true;
          return;
        }
      }
    }
  }

})
