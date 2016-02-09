app.controller('NewAttendeeCtrl', function($scope, AttendeeFactory, attendees){
  $scope.processingData = false;
  $scope.saveAttendee = function(){
    $scope.processingData = true;
    return AttendeeFactory.createOneAndLogin($scope.newAttendeeData)
    .then(function(newUser){
      $scope.processingData = false;
    })
  };

  $scope.attendees = attendees;

})
