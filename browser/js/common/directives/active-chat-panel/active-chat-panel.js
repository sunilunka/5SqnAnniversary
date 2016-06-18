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

      scope.privateGroupSessions = [];

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

      MessagingFactory.getUserGroupSessions(userId, "private", function(results){
        angular.copy(results, scope.privateGroupSessions);
        $timeout(function(){
          scope.$apply();
        }, 1)
      })

      MessagingFactory.getUserGroupSessions(userId, "public", function(results){
        angular.copy(results, scope.publicGroupSessions);
        $timeout(function(){
          scope.$apply();
        }, 1)
      })


    }
  }
})
