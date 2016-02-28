app.controller('NewAttendeeCtrl', function($scope, AttendeeFactory, attendees, $stateParams){
  $scope.user = null;
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
      console.log("NEW USER", newUser);
      $scope.user = newUser;
      $scope.processingData = false;
      /* Take user to their personal state */
    })
    .catch(function(error){
      $scope.error = error;
    })
  };

  $scope.attendees = attendees;

})
