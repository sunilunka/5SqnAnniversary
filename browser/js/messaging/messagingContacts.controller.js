app.controller("MessagingContactsCtrl", function($scope, Users, Platforms, Categories, loggedInUser){

  $scope.platforms = Platforms;
  $scope.categories = Categories;
  $scope.users = Users;
  $scope.current = loggedInUser;
})
