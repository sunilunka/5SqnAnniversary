app.controller("ManagementUsersCtrl", function($scope, $rootScope, AttendeeFactory, ManagementFactory, GuestOriginFactory, Users, Categories, Events, Platforms, $timeout){



  $scope.searchResults = Users;

  $scope.categories = Categories;

  $scope.platforms = Platforms;

  $scope.events = Events;

  $scope.$on("resultsReceived", function(event, value){
    $scope.searchResults = value;
  })

})
