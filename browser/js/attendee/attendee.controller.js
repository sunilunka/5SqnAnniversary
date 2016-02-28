app.controller("AttendeeCtrl", function($scope, AuthService, AttendeeFactory, $state){

  $scope.user = AttendeeFactory.getOne();

  // $scope.details = AttendeeFactory.getOne();

  // $scope.details = UserDetails;

})
