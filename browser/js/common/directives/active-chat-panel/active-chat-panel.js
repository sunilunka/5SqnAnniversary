app.directive("activeChatPanel", function(MessagingFactory, $timeout){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/active-chat-panel/active-chat-panel.html",
    scope: {
      user: "=",
    },
    link: function(scope, element, attrs){

      let userId = scope.user.$id || scope.user.id || scope.user.uid;

      scope.sessions = [];

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
        console.log("USER RESULTS: ", results);
        angular.copy(results, scope.sessions);
        $timeout(function(){
          scope.$apply();
        }, 1)

      })


    }
  }
})
