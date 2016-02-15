app.controller('NewAttendeeCtrl', function($scope, AttendeeFactory, attendees){
  $scope.user = null;
  $scope.processingData = false;
  $scope.error = null;
  $scope.saveAttendee = function(){
    $scope.processingData = true;
    return AttendeeFactory.createOneAndLogin($scope.newAttendeeData)
    .then(function(newUser){
      $scope.processingData = false;
      $scope.user = newUser;
    })
    .catch(function(error){
      $scope.error = error;
    })
  };

  $scope.attendees = attendees;

})
