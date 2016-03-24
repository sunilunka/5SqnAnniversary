app.controller("AttendeeCtrl", function($scope, AuthService, AttendeeFactory, User, Events, EventFactory, $state){

  $scope.user = User;

  $scope.events = Events;

})
