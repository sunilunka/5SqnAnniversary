app.directive("messagingContact", function(MessageSessionService, MessagingFactory, GuestCategoryFactory, AttendeeFactory){
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

      scope.peerToPeerChat = function(){
        MessageSessionService.setPeerToPeerSession(userId, currentUserId)
      }

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
