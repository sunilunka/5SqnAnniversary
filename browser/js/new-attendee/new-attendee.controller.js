app.controller('NewAttendeeCtrl', function($scope, $rootScope, AttendeeFactory, attendees, Events, categories, $stateParams, $state, FormValidityFactory, EventFactory){
  /* Events, and categories are promises resolved in the ui-router state. Is an array of all entries.  Allows ng-repeat to be used to present all entries */

  $scope.processingData = false;
  $scope.error = null;
  $scope.registerMethodChosen = null;

  $scope.registerMethod = (method) => {
    $scope.registerMethodChosen = method;
    if(method){
      $state.go("newAttendee." + method);
    } else {
      $state.go("newAttendee");
    }
    /* If user changes method, remove all keys from form object, and reset the available display key on events. */

    // $scope.showEvents = false;
    // $scope.newAttendeeData = {};
    // $scope.events = EventFactory.resetLimitIndicator($scope.events)
    return method;
  }

  $scope.saveAttendee = function(){
    // FormValidityFactory.submitFormCheck()
    console.log("REGISTER: ", $scope.register)
    console.log("EVENTS VALID: ", FormValidityFactory.checkEvents($scope.newAttendeeData.events))
    console.log("NEW DATA FOR SUBMISSION: ",
     $scope.newAttendeeData);
    // return AttendeeFactory.createOneAndLogin($scope.registerMethodChosen, $scope.newAttendeeData)
    // .then(function(newUser){
    //   $scope.processingData = false;
    // })
    // .catch(function(error){
    //   $scope.error = error;
    // })
  };

  $scope.attendees = attendees;

})
