app.controller("ManagementUsersCtrl", function($scope, $rootScope, AttendeeFactory, ManagementFactory, GuestOriginFactory, Users, Categories, Events, Platforms, $timeout){



  $scope.searchResults = Users;

  $scope.categories = Categories;

  $scope.platforms = Platforms;

  $scope.events = Events;

  $scope.showMessage = false;

  $scope.activity;

  $scope.$on("resultsReceived", function(event, value){
    if(!value.length){
      $scope.activity = "No users found";
      $scope.showMessage = true;
    } else {
      $scope.showMessage = false;
    }
    $scope.searchResults = value;
    $timeout(function(){
      $scope.$apply();
    }, 1)
  })

})
