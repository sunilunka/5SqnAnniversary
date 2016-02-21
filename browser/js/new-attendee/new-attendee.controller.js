app.controller('NewAttendeeCtrl', function($scope, AttendeeFactory, attendees){
  $scope.user = null;
  $scope.processingData = false;
  $scope.error = null;
  $scope.registerWithEmail = false;

  $scope.emailRegister = () => {
    $scope.registerWithEmail = true;
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
