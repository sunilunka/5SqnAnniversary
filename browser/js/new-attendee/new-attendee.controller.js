app.controller('NewAttendeeCtrl', function($scope, AttendeeFactory, attendees){
  $scope.activeState = "newAttendee";
  $scope.saveAttendee = function(){
    return AttendeeFactory.createOneAndLogin($scope.newAttendeeData)
  };

  $scope.attendees = attendees;

})
