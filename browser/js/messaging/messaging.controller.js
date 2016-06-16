app.controller("MessagingCtrl", function($scope, AuthService){

  var currentUser = AuthService.getCurrentUser();

  let userId = currentUser.uid || currentUser.id || currentUser.$id;

  $scope.options = [
    {
      title: "Find Users",
      ref: "messaging.contacts"
    },
    {
        title: "Chat Sessions",
        ref: "messaging.session({id: " + userId + "})"
    }
  ]

})
