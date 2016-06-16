app.controller("MessagingContactsCtrl", function($scope, Users, Platforms, Categories, Events, loggedInUser){

  $scope.platforms = Platforms;
  $scope.categories = Categories;
  $scope.events = Events;
  $scope.users = Users;
  $scope.current = loggedInUser;
})
