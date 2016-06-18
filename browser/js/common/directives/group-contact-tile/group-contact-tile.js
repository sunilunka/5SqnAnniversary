app.directive("groupContactTile", function(MessagingFactory, MessageSessionService, $timeout, $state, $stateParams){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/group-contact-tile/group-contact-tile.html",
    scope: {
      session: "=",
      userid: "="
    },
    link: function(scope, element, attrs){

      scope.contactState;

      if($state.current.name === "messagingContacts"){
        if(scope.session["private"]){
          scope.contactState = true
        }
      }



      scope.goToSession = function(){
        MessageSessionService.setGroupSession(scope.userid, scope.session)
      }

      scope.setGroupToModify = function(){
        console.log("SESSION TO SEND: ", scope.session);
        scope.addingUser = true;
        scope.$emit("modifyExistingGroup", scope.session);
      }

    }
  }
})
