app.controller("MessagingSessionCtrl", function($scope, $stateParams, loggedInUser, MessageSessionService, MessagingFactory, SessionMessages, NotificationService, Categories, Events, Platforms, $timeout){

  console.log("STATE PARAMS: ", $stateParams);

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

  $scope.newGroup = {
    participants: [loggedInId],
  }

  $scope.createNewGroup = false;

  $scope.filterUsers = function(){
    for(var param in $scope.filterParams){
      $scope.userFilterParams[param] = $scope.filterParams[param];
    }
  }

  $scope.createGroup = function(){
    let participants = $scope.newGroup.participants;
    return MessagingFactory.createNewGroupChat($scope.newGroup, $scope.newGroup.participants)
    .then(function(data){
      NotificationService.notify("success", "New group created!");
      let resetGroup = {
        participants: [loggedInId]
      }
      angular.copy(resetGroup, $scope.newGroup);
      $scope.$broadcast("groupCreationSuccess", {
        buttonVal: false,
        userId: participants
      });
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

  $scope.$on("userAddedToGroup", function(event, value){
    if($scope.newGroup.participants.indexOf(value) === -1){
      $scope.newGroup.participants.push(value);
      $scope.$broadcast("userAddConfirmed", {
        buttonVal: true,
        userId: value
      });
    }
  })

  $scope.$on("removeUserFromGroup", function(event, value){
    var isInArray = $scope.newGroup.participants.indexOf(value);
    if(isInArray !== -1){
      $scope.newGroup.participants.splice(isInArray, 1);
      $scope.$broadcast("userRemoveConfirmed", {
        buttonVal: false,
        userId: value
      });
    }
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
