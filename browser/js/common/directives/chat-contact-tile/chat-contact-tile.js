app.directive("chatContactTile", function(MessagingFactory, MessageSessionService){
    return {
      restrict: "E",
      templateUrl: "js/common/directives/chat-contact-tile/chat-contact-tile.html",
      scope: {
        userid: "=",
        session: "="
      },
      link: function(scope, element, attrs){
        scope.goToSession = function(){
          console.log("SESSION: ", scope.session, scope.userid);
          MessageSessionService.setPeerToPeerSession(scope.userid, scope.session.peerId)
        }
      }


    }
})
