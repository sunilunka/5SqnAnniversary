app.controller("AttendeeCtrl", function($scope, AuthService, AttendeeFactory, User, Events, EventFactory, Categories, $state){

  $scope.user = User;

  $scope.events = Events;

  $scope.userCat = Categories[User.association];


})
