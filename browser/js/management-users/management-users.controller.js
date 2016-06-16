app.controller("ManagementUsersCtrl", function($scope, $rootScope, AttendeeFactory, ManagementFactory, GuestOriginFactory, Users, Categories, Events, Platforms){

  $scope.users = Users;

  $scope.categories = Categories;

  $scope.platforms = Platforms;

  $scope.events = Events;

  $scope.loadingData = false;

  $scope.getOverseasUsers = function(){
    console.log("LOADING...");
    $scope.loadingData = true;
    GuestOriginFactory.getOverseasData(function(users){
      $scope.users = users;
      $scope.loadingData = false;
      $scope.$digest();
    });
  }


})
