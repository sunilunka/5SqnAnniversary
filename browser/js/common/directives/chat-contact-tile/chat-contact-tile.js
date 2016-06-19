app.directive("chatContactTile", function(MessagingFactory, MessageSessionService, AttendeeFactory){
    return {
      restrict: "E",
      templateUrl: "js/common/directives/chat-contact-tile/chat-contact-tile.html",
      scope: {
        userid: "=",
        session: "="
      },
      link: function(scope, element, attrs){

        scope.missedMsgs = "?";

        scope.goToSession = function(){
          MessageSessionService.setPeerToPeerSession(scope.userid, scope.session.peerId)
        }

        AttendeeFactory.watchOnlineState(scope.session.peerId, function(snapshot){
          let onlineState = snapshot.val();
          scope.session.online = onlineState;
        })

        if(scope.session.hasOwnProperty("sessionId")){
          MessagingFactory.watchMissedMessages(scope.userid, scope.sessionId, function(missedMsgs){
            scope.missedMsgs = missedMsgs;
          })
        }

      }


    }
})
