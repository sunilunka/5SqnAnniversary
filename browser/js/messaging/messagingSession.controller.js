app.controller("MessagingSessionCtrl", function($scope, loggedInUser, MessageSessionService, MessagingFactory, SessionMessages, NotificationService){

  var currentUser = loggedInUser;
  $scope.user = loggedInUser;
  $scope.newMessage = {};
  $scope.messages = SessionMessages;

  console.log("SESSION MESSAGES: ", SessionMessages);

  $scope.transmit = () => {
    $scope.newMessage.author = currentUser.firstName;
    MessageSessionService.sendMessage($scope.newMessage)
    .then(function(){
      $scope.newMessageForm.$setUntouched()
      $scope.newMessageForm.$setPristine();
      $scope.newMessage = {};
    })
    .catch(function(error){
      console.log("ERROR FOUND: ", error);
      NotificationService.notify("error", "Sorry, an we can't seem to get through to the server...sounds like a poor radio operator.")
    })
  }


})
