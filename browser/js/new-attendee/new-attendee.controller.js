app.controller('NewAttendeeCtrl', function($scope, AttendeeFactory, attendees){
  $scope.activeState = "newAttendee";
  $scope.saveAttendee = function(){
    return AttendeeFactory.createOne($scope.newAttendeeData)
  };

  $scope.attendees = attendees;

})
