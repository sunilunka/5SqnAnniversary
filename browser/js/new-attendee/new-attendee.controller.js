app.controller('NewAttendeeCtrl', function($scope, $rootScope, AttendeeFactory, attendees, Events, categories, $stateParams, $state, FormValidityFactory, EventFactory){
  /* Events, and categories are promises resolved in the ui-router state. Is an array of all entries.  Allows ng-repeat to be used to present all entries */

  $scope.events = Events;
  $scope.categories = categories;
  $scope.processingData = false;
  $scope.error = null;
  $scope.registerMethodChosen = null;
  $scope.newAttendeeData;
  $scope.passwordsNotValid;

  $scope.passwordsMatch = () => {
    console.log("FORM VALIDITY: ", $scope.register);
    let pOne = $scope.passwordOne || false;
    let pTwo = $scope.newAttendeeData.password || false;
    console.log("P1: ", $scope.register.passwordOne.$dirty);
    console.log("P2: ", $scope.register.passwordTwo.$dirty);
    return pOne ? (pTwo ? (pOne === pTwo) : false) : false;
 }

  $scope.registerMethod = (method) => {
    $scope.registerMethodChosen = method;
    /* If user changes method, remove all keys from form object, and reset the available display key on events. */
    $scope.newAttendeeData = {};
    $scope.events = EventFactory.resetLimitIndicator($scope.events)
    return method;
  }

  $scope.saveAttendee = function(){
    $scope.processingData = true;
    return AttendeeFactory.createOneAndLogin($scope.registerMethodChosen, $scope.newAttendeeData)
    .then(function(newUser){
      $scope.processingData = false;
    })
    .catch(function(error){
      $scope.error = error;
    })
  };

  $scope.attendees = attendees;

})
