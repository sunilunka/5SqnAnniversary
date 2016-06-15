app.directive("messagingContact", function(MessageSessionService, MessagingFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/messaging-contact/messaging-contact.html",
    scope: {
      user: "=",
      platforms: "=",
      categories: "=",
      current: "="
    },
    link: function(scope, element, attrs){

      let user = scope.user;

      let currentUserId = scope.current.id || scope.current.$id || scope.current.uid;

      let userId = user.$id;

      scope.association = scope.categories[user.association];

      scope.peerToPeerChat = function(){
        console.log("USER DETAILS: ", userId, currentUserId);
        MessagingFactory.checkMessageSessionExists(currentUserId, userId)
        // MessageSessionService.setPeerToPeerSession(userId, currentUserId)
      }

    }
  }
})
