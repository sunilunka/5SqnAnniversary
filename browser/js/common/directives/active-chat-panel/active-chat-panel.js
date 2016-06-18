app.directive("activeChatPanel", function(MessagingFactory, $timeout){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/active-chat-panel/active-chat-panel.html",
    scope: {
      user: "=",
    },
    link: function(scope, element, attrs){
      let userId = scope.user.$id || scope.user.id || scope.user.uid;

      scope.userId = userId;

      scope.peerSessions = [];

      scope.userGroupSessions = [];

      scope.publicGroupSessions = [];

      let displayActive = false;

      scope.toggleDisplay = function(){
        displayActive = !displayActive;
        if(displayActive){
          element.addClass("panel-active");
        } else {
          element.removeClass("panel-active");
        }
      }

      MessagingFactory.getPeerToPeerSessions(userId, function(results){
        angular.copy(results, scope.peerSessions);
        $timeout(function(){
          scope.$apply();
        }, 1)

      })

      MessagingFactory.getUserGroupSessions(userId, function(results){
        angular.copy(results, scope.userGroupSessions);
        $timeout(function(){
          scope.$apply();
        }, 1)
      })

      MessagingFactory.getPublicGroups()
      .then(function(array){
        angular.copy(array, scope.publicGroupSessions);
        // $timeout(function(){
        //   scope.$apply();
        // }, 1)
      })


    }
  }
})
