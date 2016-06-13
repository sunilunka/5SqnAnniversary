app.controller("AttendeeCtrl", function($scope, AuthService, AttendeeFactory, User, Events, Announcements, EventFactory, Categories, $state){

  $scope.user = User;

  $scope.events = Events;

  $scope.userCat = Categories[User.association];

  $scope.allAnnouncements = Announcements;


})
