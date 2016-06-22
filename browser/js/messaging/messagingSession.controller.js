app.controller("MessagingSessionCtrl", function($scope, $stateParams, $state, loggedInUser, MessageSessionService, MessagingFactory, SessionMessages, NotificationService, Categories, Events, Platforms, $timeout, $rootScope){

  $scope.sessionIsGroup = false;

  if($stateParams.sessionId === "no-session"){
    MessageSessionService.resetSessionDetails();
  }

  var currentSessionDetails = MessageSessionService.getCurrentSessionDetails();

  if(currentSessionDetails.hasOwnProperty("name")){
    $scope.sessionName = currentSessionDetails.name;
    $scope.sessionIsGroup = true;
  }

  $scope.categories = Categories;
  $scope.events = Events;
  $scope.platforms = Platforms;

  var currentUser = loggedInUser;
  $scope.user = loggedInUser;
  $scope.newMessage = {};
  $scope.messages = SessionMessages;
  $scope.filterParams = {};

  var loggedInId = loggedInUser.$id || loggedInUser.uid || loggedInUser.id;

  $scope.loggedInId = loggedInId;

  $scope.membersLoaded = false;

  $scope.sessionMembers = [];

  /* Get current session members */

  MessagingFactory.getSessionMembers($stateParams.sessionId, loggedInId, function(data){
    $scope.membersLoaded = true;
    angular.copy(data, $scope.sessionMembers);
    $timeout(function(){
      $scope.$apply();
    }, 1);
  })

  $scope.searchResults = [];

  $scope.showMessage = false;

  $scope.activity;

  $scope.userFilterParams = {};

  $scope.creatingNewGroup = {
    label: "Create New Group",
    display: false
  }

  $scope.newGroup = {};

  $scope.groupPrivate = "Make Private";

  $scope.createNewGroup = function(){
    if($scope.creatingNewGroup.display){
      angular.copy({}, $scope.newGroup);
      $scope.creatingNewGroup.display = false;
      $scope.creatingNewGroup.label = "Create New Group";
      MessageSessionService.createNewGroupInProgress(false);
    } else {
      MessageSessionService.createNewGroupInProgress(true, loggedInId);
      $scope.creatingNewGroup.display = true;
      $scope.creatingNewGroup.label = "Cancel Group Creation"
    }
  }

  $scope.makePrivateGroup = function(){
    event.preventDefault();
    if($scope.creatingNewGroup.display){
      if(!$scope.newGroup.private){
        $scope.newGroup.private = true;
        $scope.groupPrivate = "Revert group back to public";
      } else {
        $scope.newGroup.private = false;
        $scope.groupPrivate = "Make Private";
      }
    }
  }

  $scope.filterUsers = function(){
    for(var param in $scope.filterParams){
      $scope.userFilterParams[param] = $scope.filterParams[param];
    }
  }

  var resetGroupCreation = function(){
    $scope.newGroup = {};
    $scope.creatingNewGroup.display = false;
    $scope.creatingNewGroup.label = "Create New Group"
    MessageSessionService.createNewGroupInProgress(false);
    return;
  }

  $scope.createGroup = function(){
    let participants = MessageSessionService.getNewGroupMembers();
    return MessagingFactory.createNewGroupChat($scope.newGroup, participants)
    .then(function(data){
      NotificationService.notify("success", "New group created!");
      resetGroupCreation();
      let groupType = null;
      if(data["private"]){
        groupType = "private";
      } else {
        groupType = "public";
      }
      MessageSessionService.setGroupSessionDetails(data);
      $state.go("messagingSession", {id: loggedInId, sessionId: data.sessionId, sessionType: groupType });
    })
    .catch(function(error){
      NotificationService.notify("error", "Sorry an error occured: " + error);
      resetGroupCreation();
    })
  }


  $scope.$on("resultsReceived", function(event, value){
    angular.copy([], $scope.searchResults);
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


  $scope.transmit = () => {
    if($stateParams.sessionId === "no-session") return;
    $scope.newMessage.author = currentUser.firstName + " " + currentUser.lastName;
    $scope.newMessage.authorId = loggedInId;
    MessageSessionService.sendMessage($scope.newMessage)
    .then(function(data){
      MessagingFactory.updateMissedMessages($stateParams.sessionId, loggedInId)
      angular.copy({}, $scope.newMessage);
      $scope.newMessageForm.$setUntouched()
      $scope.newMessageForm.$setPristine();
    })
    .catch(function(error){
      NotificationService.notify("error", "Sorry, an we can't seem to get through to the server...sounds like a poor radio operator.")
    })
  }


  /* On load, detect if window width is less than 768px, if so make the activeTab chatContact or else if no session, then activeTab is search */
  $scope.activeTab = "members"

  if($stateParams.sessionId === "no-session"){
    $scope.activeTab = "search";
  } else {
    if((window.innerWidth < 768) && ($stateParams.sessionId !== "no-session")){
      $scope.activeTab = "currentChat";
    }
  }


  $scope.viewSelector = function(viewName){
    $scope.activeTab = viewName;
  }


})
