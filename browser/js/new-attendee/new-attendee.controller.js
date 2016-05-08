app.controller('NewAttendeeCtrl', function($scope, AttendeeFactory, attendees, Events, $stateParams, $state){
  /* Events is a promise resolved in the ui-router state. Is an array of all events. Allows ng-repeat to be used to present all events. To user. */
  $scope.events = Events;
  $scope.processingData = false;
  $scope.error = null;
  $scope.registerMethodChosen = null;

  $scope.registerMethod = (method) => {
    $scope.registerMethodChosen = method;
    return method;
  }

  $scope.saveAttendee = function(){
    $scope.processingData = true;
    console.log("STATE PARAMS: ", $stateParams)
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
