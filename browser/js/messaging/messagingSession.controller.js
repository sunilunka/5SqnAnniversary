app.controller("MessagingSessionCtrl", function($scope, $stateParams, loggedInUser, MessageSessionService, MessagingFactory, SessionMessages, NotificationService, Categories, Events, Platforms, $timeout){

  $scope.categories = Categories;
  $scope.events = Events;
  $scope.platforms = Platforms;

  var currentUser = loggedInUser;
  $scope.user = loggedInUser;
  $scope.newMessage = {};
  $scope.messages = SessionMessages;
  $scope.filterParams = {};

  var loggedInId = loggedInUser.$id || loggedInUser.uid || loggedInUser.id;

  $scope.searchResults = [];

  $scope.showMessage = false;

  $scope.activity;

  $scope.userFilterParams = {};

  $scope.creatingNewGroup = {
    label: "Create New Group",
    display: false
  }

  $scope.createNewGroup = function(){
    if($scope.creatingNewGroup.display){
      $scope.newGroup = {};
      $scope.creatingNewGroup.display = false;
      $scope.creatingNewGroup.label = "Create New Group";
      MessageSessionService.createNewGroupInProgress(false);
    } else {
      MessageSessionService.createNewGroupInProgress(true);
      $scope.creatingNewGroup.display = true;
      $scope.creatingNewGroup.label = "Cancel Group Creation"
    }
  }


  $scope.filterUsers = function(){
    for(var param in $scope.filterParams){
      $scope.userFilterParams[param] = $scope.filterParams[param];
    }
  }

  $scope.createGroup = function(){
    let participants = MessageSessionService.getNewGroupMembers();
    return MessagingFactory.createNewGroupChat($scope.newGroup, participants)
    .then(function(data){
      NotificationService.notify("success", "New group created!");
      $scope.newGroup = null;
      $scope.creatingNewGroup = false;
      MessageSessionService.createNewGroupInProgress(false);
    })
    .catch(function(error){
      NotificationService.notify("error", "Sorry an error occured: " + error);
    })
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


  console.log("SESSION MESSAGES: ", SessionMessages);

  $scope.transmit = () => {
    $scope.newMessage.author = currentUser.firstName;
    $scope.newMessage.authorId = (currentUser.id || currentUser.$id || currentUser.uid);
    MessageSessionService.sendMessage($scope.newMessage)
    .then(function(){
      $scope.newMessageForm.$setUntouched()
      $scope.newMessageForm.$setPristine();
      $scope.newMessage = {};
    })
    .catch(function(error){
      NotificationService.notify("error", "Sorry, an we can't seem to get through to the server...sounds like a poor radio operator.")
    })
  }

})
