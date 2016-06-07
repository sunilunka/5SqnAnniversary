app.directive("newAttendeeExternalForm", function(AttendeeFactory, FormValidityFactory){
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
          /* If events object is populated then continue the registration and login process. */
          return RegisterFactory.registerNewUser("facebook", scope.newAttendeeData);
        } else {
          /* If the check for events is false, then return, as the user has not entered in any events to attend. */
          scope.eventsError = true;
          return;
        }
      }
    }
  }

})
