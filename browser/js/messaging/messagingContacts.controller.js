app.controller("MessagingContactsCtrl", function($scope, Platforms, Categories, Events, loggedInUser, $timeout){

  $scope.platforms = Platforms;
  $scope.categories = Categories;
  $scope.events = Events;
  $scope.current = loggedInUser;

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
