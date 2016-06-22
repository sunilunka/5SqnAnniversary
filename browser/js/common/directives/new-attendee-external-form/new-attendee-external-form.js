app.directive("newAttendeeExternalForm", function(SiteAuthFactory, AttendeeFactory, RegisterFactory, FormValidityFactory, $stateParams){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/new-attendee-external-form/new-attendee-external-form.html",
    scope: {
      events: "=",
      categories: "=",
      platforms: "=",
      method: "="
    },
    link: function(scope, element, attrs){
;
      scope.showEvents = false;
      scope.checkboxError = false;
      scope.newAttendeeData = {};
      scope.checkboxErrorMessage;

      scope.saveAttendee = function(){
        var eventsValid = FormValidityFactory.checkEvents(scope.newAttendeeData);
        var platformsValid = FormValidityFactory.checkPlatforms(scope.newAttendeeData);
        if(eventsValid && platformsValid){
          scope.checkboxError = false;
          /* If events and platforms object is populated then continue the registration and login process.
            => If state params has both a provider and referredUid keys on the $stateParams object, then attempt to save as referred user who has attempted to login without registering.
            => Otherwise, the user is registering for the first time, continue with register new user, this uses all the same data      as a normal external provider form.
          */
          if($stateParams.hasOwnProperty("provider") && $stateParams.hasOwnProperty("referredUid")){
            return AttendeeFactory.createReferredUser($stateParams.provider, $stateParams.referredUid, scope.newAttendeeData)
            .then(function(data){
              /* Once user is created, pull details from database to populate session */
              AttendeeFactory.getOne($stateParams.referredUid)
              .then(function(userObj){
                SiteAuthFactory.setSessionAndReRoute(userObj, "attendee", $stateParams.uid);
              })
              .catch(function(error){
                scope.checkboxError = true;
                scope.checkboxErrorMessage = "Sorry an error occured: " + error.message;
              })
            })
            .catch(function(error){
              scope.checkboxError = true;
              scope.checkboxErrorMessage = "Sorry an error occured: " + error.message;
            })
          } else {
            /* If state params does not contain any of those keys, user is registering for the first time and has not been referred. */
            return RegisterFactory.registerNewUser(scope.method, scope.newAttendeeData);
          }
        } else if(!eventsValid || !platformsValid){
          if(!eventsValid && !platformsValid){
            scope.checkboxErrorMessage = "To register, it would be great to know what aircraft you worked with on Squadron and the events you would like to attend. Thanks!"
          } else if (!eventsValid){
            scope.checkboxErrorMessage = "Sorry, looks like you haven't told us what event(s) you want to attend, please select one or more. Thanks!"
          } else if (!platformsValid){
            scope.checkboxErrorMessage = "It would be great if you could let us know the aircraft you worked with on Squadron before registering. Thanks!"
          }
          scope.checkboxError = true;
        }
      }
    }
  }

})
