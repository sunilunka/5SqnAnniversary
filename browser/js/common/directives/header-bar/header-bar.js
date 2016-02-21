app.directive("headerBar", function($state, $rootScope, AuthService){

  return {
    restrict: 'E',
    templateUrl: "/js/common/directives/header-bar/header-bar.html",
    scope: {},
    link: function(scope){

      scope.currentUser = null;

      scope.logoutUser = () => {
        AuthService.logout();
      }

      $rootScope.$on('loggedIn', function(event, authData){
        
        scope.currentUser = authData;
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
