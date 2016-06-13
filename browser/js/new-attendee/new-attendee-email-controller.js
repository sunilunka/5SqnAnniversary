app.controller("NewAttendeeEmailCtrl", function($scope, AttendeeFactory, Events, categories, platforms, FormValidityFactory, EventFactory){
  $scope.events = Events;
  $scope.categories = categories;
  $scope.platforms = platforms;
  $scope.showEvents = false;
  $scope.checkboxError = false;
  $scope.checkboxErrorMessage;
  $scope.newAttendeeData = {};

  $scope.saveAttendee = function(){
    var eventsValid = FormValidityFactory.checkEvents($scope.newAttendeeData);
    var platformsValid = FormValidityFactory.checkPlatforms($scope.newAttendeeData);
    if(eventsValid && platformsValid){
      $scope.checkboxError = false;
      console.log("FORM DATA: ", $scope.newAttendeeData);
      return AttendeeFactory.createOneAndLogin("email", $scope.newAttendeeData)
      .then(function(data){
        return authData;
      })
      .catch(function(error){
        $scope.checkboxError = true;
        $scope.checkboxErrorMessage = "Sorry an error occured: " + error.message;
      })
    } else if(!eventsValid || !platformsValid){
      if(!eventsValid && !platformsValid){
        $scope.checkboxErrorMessage = "To register, it would be great to know what aircraft you worked with on Squadron and the events you would like to attend. Thanks!"
      } else if (!eventsValid){
        $scope.checkboxErrorMessage = "Sorry, looks like you haven't told us what event(s) you want to attend, please select one or more. Thanks!"
      } else if (!platformsValid){
        $scope.checkboxErrorMessage = "It would be great if you could let us know what platforms you worked with on Squadron before registering. Thanks!"
      }
      $scope.checkboxError = true;
      /* Will implement registering with email once new SDK becomes available. */
    }
  }

})
