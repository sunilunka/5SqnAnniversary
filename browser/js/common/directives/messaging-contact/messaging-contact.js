app.directive("messagingContact", function(MessageSessionService, MessagingFactory, GuestCategoryFactory, AttendeeFactory, $timeout, $stateParams){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/messaging-contact/messaging-contact.html",
    scope: {
      user: "=",
      current: "="
    },
    link: function(scope, element, attrs){

      let user = scope.user;

      let currentUserId = scope.current.id || scope.current.$id || scope.current.uid;

      let userId = user.$id;

      scope.userInSession = false;

      scope.addToExistingGroup = false;

      console.log("CURRENT STATE: ", $stateParams);
      if($stateParams.sessionId !== "no-session"){

      }
      GuestCategoryFactory.resolveName(user.association, function(name){
        scope.association = name;
      })

      AttendeeFactory.watchOnlineState(userId, function(snapshot){
        scope.user.online = snapshot.val();
      })

      MessagingFactory.listenToUserSessions(userId, $stateParams.sessionId, function(snapshot){
        console.log("USER SESSIONS: ", snapshot.val(),  $stateParams.sessionId);
        let snapVal = snapshot.val();
        /* If the returned value is truthy, then the type will be number, otherwise the returned value from .val() will be null. Cannot compare by snapshot.key, as this is retained for reference and comparing the snapshot.key and sessionId will therefore always be true. */
        if(typeof(snapVal) === "number"){
          if($stateParams.sessionId !== "no-session"){
            scope.userInSession = true;
          }
          $timeout(function(){
            scope.$apply();
          })
        }
      })


      scope.peerToPeerChat = function(){
        MessageSessionService.setPeerToPeerSession(userId, currentUserId)
      }

      scope.addToGroup = function(){
        console.log("EMITTING: ", userId);
        scope.$emit("userAddedToGroup", userId);
      }

      scope.removeFromGroup = function(){
        scope.$emit("removeUserFromGroup", userId);
      }

      var processBroadcast = function(broadcastObj){
        if(Array.isArray(broadcastObj.userId)){
          if(broadcastObj.userId.indexOf(userId) !== -1){
            scope.addedToGroup = broadcastObj.buttonVal;
          }
        } else {
          if(broadcastObj.userId === userId){
            scope.addedToGroup = broadcastObj.buttonVal;
          }
        }
      }

      scope.$on("userAddConfirmed", function(event, value){
        processBroadcast(value);
      })

      scope.$on("groupCreationSuccess", function(event, value){
        processBroadcast(value);
      })


      scope.$on("userRemoveConfirmed", function(event, value){
        processBroadcast(value);
      })


    }
  }
})
