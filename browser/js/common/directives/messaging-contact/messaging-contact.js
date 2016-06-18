app.directive("messagingContact", function(MessageSessionService, MessagingFactory, GuestCategoryFactory, AttendeeFactory, $timeout){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/messaging-contact/messaging-contact.html",
    scope: {
      user: "=",
      current: "="
    },
    link: function(scope, element, attrs){

      scope.addedToGroup = false;

      scope.addToExistingGroup = false;

      let user = scope.user;

      let currentUserId = scope.current.id || scope.current.$id || scope.current.uid;

      let userId = user.$id;

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

      scope.$watch(function(){
        return scope.user
      }, function(newValue, oldValue){
        GuestCategoryFactory.resolveName(user.association, function(name){
          scope.association = name;
          scope.$apply();
        })
      })

      AttendeeFactory.watchOnlineState(userId, function(snapshot){
        scope.user.online = snapshot.val();
      })

    }
  }
})
