app.directive("headerBar", function($state, $rootScope, AuthService){

  return {
    restrict: 'E',
    templateUrl: "/js/common/directives/header-bar/header-bar.html",
    scope: {},
    link: function(scope){

      scope.currentUser = null;

      scope.isManager = null;

      scope.goToUserProfile = () => {
        $state.go("attendee", {id: scope.currentUser.uid || scope.currentUser.id || scope.currentUser.$id })
      }

      scope.logoutUser = () => {
        AuthService.logout();
      }

      $rootScope.$on('loggedIn', function(event, authData){

        scope.currentUser = AuthService.getCurrentUser();

        let currentUserId = scope.currentUser.id || scope.currentUser.$id || scope.currentUser.uid;

        scope.isManager = AuthService.checkUserIsManager(currentUserId) && scope.currentUser["manager"];
      })

      $rootScope.$on('loggedOut', () => {
        scope.currentUser = null;
      })

    }
  }
})
