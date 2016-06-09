app.directive("newAttendeeExternalForm", function(SiteAuthFactory, AttendeeFactory, RegisterFactory, FormValidityFactory, $stateParams){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/new-attendee-external-form/new-attendee-external-form.html",
    scope: {
      events: "=",
      categories: "=",
      method: "="
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
          /* If events object is populated then continue the registration and login process.
            => If state params has both a provider and referredUid are keys on the $stateParams object, then attempt to save as referred user who has attempted to login without registering.
            => Otherwise, the user is registering for the first time, continue with register new user.
          */
          if($stateParams.hasOwnProperty("provider") && $stateParams.hasOwnProperty("referredUid")){
            return AttendeeFactory.createReferredUser($stateParams.provider, $stateParams.referredUid, scope.newAttendeeData)
            .then(function(userData){
              SiteAuthFactory.setSessionAndReRoute(userData, "attendee", $stateParams.uid);
            })
          } else {
            /* If state params does not contain any of those keys, user is registering for the first time. */
            return RegisterFactory.registerNewUser(scope.method, scope.newAttendeeData);
          }
        } else {
          /* If the check for events is false, then return, as the user has not entered in any events to attend. */
          scope.eventsError = true;
          return;
        }
      }
    }
  }

})
