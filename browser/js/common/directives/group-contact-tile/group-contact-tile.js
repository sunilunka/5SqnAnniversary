app.directive("groupContactTile", function(MessagingFactory, MessageSessionService, NotificationService, $timeout, $state, $stateParams){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/group-contact-tile/group-contact-tile.html",
    scope: {
      session: "=",
      userid: "="
    },
    link: function(scope, element, attrs){
      console.log("GROUP USER SESSION: ", scope.session);
      scope.goToSession = function(){
        MessageSessionService.setGroupSession(scope.userid, scope.session)
      }

      scope.leaveGroup = function(){
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

    }
  }
})
