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

      GuestCategoryFactory.resolveName(user.association, function(name){
        scope.association = name;
      })

      AttendeeFactory.watchOnlineState(userId, function(snapshot){
        scope.user.online = snapshot.val();
      })

    }
  }
})
