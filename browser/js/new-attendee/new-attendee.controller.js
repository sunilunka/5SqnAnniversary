app.controller('NewAttendeeCtrl', function($scope, AttendeeFactory, attendees){
  $scope.user = null;
  $scope.processingData = false;
  $scope.error = null;
  $scope.registerWithEmail = false;
  $scope.registerMethodChosen = null;

  $scope.registerMethod = (method) => {
    $scope.registerMethodChosen = method;
    return method;
  }

  $scope.emailRegister = () => {
    $scope.registerWithEmail = true;
    $scope.registerMethodChosen = true;
  }
  $scope.saveAttendee = function(){
    $scope.processingData = true;
    return AttendeeFactory.createOneAndLogin($scope.newAttendeeData)
    .then(function(newUser){
      console.log("NEW USER", newUser);
      $scope.user = newUser;
      $scope.processingData = false;
    })
    .catch(function(error){
      $scope.error = error;
    })
  };

  $scope.attendees = attendees;

})
