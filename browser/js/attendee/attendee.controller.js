app.controller("AttendeeCtrl", function($scope, AuthService, AttendeeFactory, User, Events, EventFactory, Categories, $state){

  $scope.user = User;

  $scope.events = EventFactory.checkLimits(Events, User.association);

  $scope.userCat = Categories[User.association];


})
