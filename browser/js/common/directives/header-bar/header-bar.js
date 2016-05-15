app.directive("headerBar", function($state, $rootScope, AuthService){

  return {
    restrict: 'E',
    templateUrl: "/js/common/directives/header-bar/header-bar.html",
    scope: {},
    link: function(scope){

      scope.currentUser = null;

      scope.goToUserProfile = () => {
        $state.go("attendee", {id: scope.currentUser.uid})
      }

      scope.logoutUser = () => {
        console.log("LOGGING OUT NOW!!!")
        AuthService.logout();
      }

      $rootScope.$on('loggedIn', function(event, authData){

        scope.currentUser = AuthService.getCurrentUser();
      })

      $rootScope.$on('loggedOut', () => {
        scope.currentUser = null;
      })

      scope.links = [
        {title: "Home", state: "home"},
        {title: "About", state: "about"},
        {title: "Anniversary", state: "newAttendee"}
      ]
    }
  }

})
