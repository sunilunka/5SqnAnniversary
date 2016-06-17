app.controller("ManagementUsersCtrl", function($scope, $rootScope, AttendeeFactory, ManagementFactory, GuestOriginFactory, Users, Categories, Events, Platforms, $timeout, AuthService){

  $scope.user = AuthService.getCurrentUser();

  $scope.searchResults = [];

  $scope.categories = Categories;

  $scope.platforms = Platforms;

  $scope.events = Events;

  $scope.showMessage = false;

  $scope.activity;

  $scope.userFilterParams = {};

  $scope.filterUsers = function(){
    for(var param in $scope.filterParams){
      $scope.userFilterParams[param] = $scope.filterParams[param];
    }
  }


  $scope.$on("resultsReceived", function(event, value){
    if(!value.length){
      $scope.activity = "No users found";
      $scope.showMessage = true;
    } else {
      $scope.showMessage = false;
    }
    angular.copy(value, $scope.searchResults);
    $timeout(function(){
      $scope.$apply();
    }, 1)
  })

})
