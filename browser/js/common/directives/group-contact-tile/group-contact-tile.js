app.directive("groupContactTile", function(MessagingFactory, MessageSessionService, NotificationService, $timeout, $state, $stateParams){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/group-contact-tile/group-contact-tile.html",
    scope: {
      session: "=",
      userid: "="
    },
    link: function(scope, element, attrs){

      scope.goToSession = function(){
        MessageSessionService.setGroupSession(scope.userid, scope.session)
      }

      scope.leaveGroup = function(){
        let removeFromSessionKey = scope.session.sessionId;
        if(MessageSessionService.getSession() === removeFromSessionKey){
          MessageSessionService.leaveSession();
          $state.go("attendee", {id: scope.userid});
        }
        return MessagingFactory.removeUserFromGroup(scope.userid, scope.session)
        .then(function(data){
          NotificationService.notify("success", "You have left the group");
          return;
        })
        .catch(function(error){
          NotificationService.notify("error", "Sorry you haven't been removed from the group due to an error:  " + error.message);
          return;
        })
      }

      if(scope.session.hasOwnProperty("sessionId")){
        MessagingFactory.watchMissedMessages(scope.userid, scope.session.sessionId, function(missedMsgs){
          scope.missedMsgs = missedMsgs;
          $timeout(function(){
            scope.$apply();
          },1)
        })
      }

      scope.canLeaveGroup = false;

      MessagingFactory.checkPartOfPublicGroup(scope.session.sessionId, scope.userid, function(value){
        if(value){
          scope.canLeaveGroup = value;
        } else {
          scope.canLeaveGroup = value;
        }
        $timeout(function(){
          scope.$apply();
        }, 1);
      })

    }
  }
})
