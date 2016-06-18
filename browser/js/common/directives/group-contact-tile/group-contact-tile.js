app.directive("groupContactTile", function(MessagingFactory, MessageSessionService, $timeout, $state, $stateParams){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/group-contact-tile/group-contact-tile.html",
    scope: {
      session: "=",
      userid: "="
    },
    link: function(scope, element, attrs){

      scope.goToSession = function(){
        MessageSessionService.setGroupSession(scope.userid, scope.session)
      }

      scope.addToGroupSession = function(){

      }

    }
  }
})
