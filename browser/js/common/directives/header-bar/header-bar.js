app.directive("headerBar", function($state, $rootScope, AuthService, DatabaseFactory){

  return {
    restrict: 'E',
    templateUrl: "/js/common/directives/header-bar/header-bar.html",
    scope: {},
    link: function(scope){

      var managementRef = DatabaseFactory.dbConnection("managers");

      scope.currentUser = null;

      scope.isManager = null;

      let currentUserId = null;

      scope.goToUserProfile = () => {
        $state.go("attendee", {id: scope.currentUser.uid || scope.currentUser.id || scope.currentUser.$id })
      }

      scope.logoutUser = () => {
        AuthService.logout();
      }

      let monitorManagementState = function(snapshot){
        let userId = currentUserId || AuthService.getCurrentUser().uid;
        let snapVal = snapshot.val();
        if(snapVal){
          if(snapVal[userId]){
            scope.isManager = true;
          } else {
            scope.isManager = false;
          }
        }
      }

      $rootScope.$on('loggedIn', function(event, authData){

        scope.currentUser = AuthService.getCurrentUser();

        currentUserId = scope.currentUser.id || scope.currentUser.$id || scope.currentUser.uid;

        managementRef.on("value", monitorManagementState);

      })

      $rootScope.$on('loggedOut', () => {
        managementRef.off("value", monitorManagementState)
        scope.currentUser = null;
        scope.isManager = null;
        currentUserId = null;
      })
    }
  }
})
