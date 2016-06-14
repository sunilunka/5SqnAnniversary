app.controller("ManagementUsersCtrl", function($scope, AttendeeFactory, Users, Categories, Events, Platforms){

  $scope.users = Users;

  $scope.categories = Categories;

  $scope.platforms = Platforms;

  $scope.events = Events;

})
