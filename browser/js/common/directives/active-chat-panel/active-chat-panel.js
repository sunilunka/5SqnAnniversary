app.directive("activeChatPanel", function(MessagingFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/active-chat-panel/active-chat-panel.html",
    scope: {
      userchats: "=",
      groupchats: "="
    },
    link: function(scope, element, attrs){
      
    }
  }
})
