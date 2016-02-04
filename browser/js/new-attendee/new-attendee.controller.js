app.controller('NewAttendeeCtrl', function($scope, AttendeeFactory, attendees){
  $scope.saveAttendee = function(){
    return AttendeeFactory.saveOne($scope.newAttendeeData)
  };

  $scope.attendees = attendees;

})
