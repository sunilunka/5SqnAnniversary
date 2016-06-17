app.directive("groupContactTile", function(MessagingFactory, MessageSessionService, $timeout){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/group-contact-tile/group-contact-tile.html",
    scope: {
      session: "=",
      userid: "=",
      mode: "="
    },
    link: function(scope, element, attrs){
      scope.goToSession = function(){
        MessageSessionService.setGroupSession(scope.userid, scope.session)
      }

      scope.activeGroup = function(){
        scope.$emit("makeActiveGroup", session);
      }

    }
  }
})
