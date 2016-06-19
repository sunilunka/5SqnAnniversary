app.directive("chatMessageOutput", function(){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/chat-message-output/chat-message-output.html",
    scope: {
      message: "=",
      userid: "="
    },
    link: function(scope, element, attrs){
      if(scope.userid === scope.message.authorId){
        element.addClass("current-user-message");
      } else {
        element.addClass("other-user-message");
      }

    }
  }
})
