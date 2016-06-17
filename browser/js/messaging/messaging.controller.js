app.controller("MessagingCtrl", function($scope, AuthService){

  var currentUser = AuthService.getCurrentUser();

  let userId = currentUser.uid || currentUser.id || currentUser.$id;

  /* Needed for chat feature */
  $scope.user = currentUser;

  $scope.options = [
    {
      title: "Search for contacts or create a group",
      ref: "messaging.contacts"
    }
  ]

})
