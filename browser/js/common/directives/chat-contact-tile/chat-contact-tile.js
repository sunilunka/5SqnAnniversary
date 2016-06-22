app.directive("chatContactTile", function(MessagingFactory, MessageSessionService, AttendeeFactory, GuestCategoryFactory, AuthService, $timeout, $state){
    return {
      restrict: "E",
      templateUrl: "js/common/directives/chat-contact-tile/chat-contact-tile.html",
      scope: {
        userid: "=",
        session: "="
      },
      link: function(scope, element, attrs){

        scope.association = null;
        GuestCategoryFactory.resolveName(AuthService.getCurrentUser().association, function(associationName){
          scope.association = associationName;
          $timeout(function(){
            scope.$apply();
          },1)
        })

        scope.missedMsgs;

        scope.goToSession = function(){
          MessageSessionService.setPeerToPeerSession(scope.userid, scope.session.peerId)
        }

        AttendeeFactory.watchOnlineState(scope.session.peerId, function(snapshot){
          let onlineState = snapshot.val();
          scope.session.online = onlineState;
        })


        if(scope.session.hasOwnProperty("$id")){
          MessagingFactory.watchMissedMessages(scope.userid, scope.session.$id, function(missedMsgs){
            scope.missedMsgs = missedMsgs;
            $timeout(function(){
              scope.$apply();
            },1)
          })
        }

      }


    }
})
