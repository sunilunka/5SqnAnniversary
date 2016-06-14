app.controller("ManagementUsersCtrl", function($scope, AttendeeFactory, ManagementFactory, GuestOriginFactory, Users, Categories, Events, Platforms){

  $scope.users = Users;

  $scope.categories = Categories;

  $scope.platforms = Platforms;

  $scope.events = Events;

  $scope.getOverseasUsers = function(){
    return GuestOriginFactory.getOverseasData();
  }

  $scope.getCategoryUsers = function(){
    return ManagementFactory.getCategoryUsers();
  }

})
