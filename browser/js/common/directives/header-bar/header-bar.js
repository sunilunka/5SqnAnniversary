app.directive("headerBar", function($state, $rootScope){

  return {
    restrict: 'E',
    templateUrl: "/js/common/directives/header-bar/header-bar.html",
    scope: {},
    link: function(scope){

      scope.currentState = function(){
        return $state.current.name;
      }

      scope.links = [
        {title: "Home", state: "home"},
        {title: "About Us", state: "about"},
        {title: "Anniversary", state: "newAttendee"}
      ]
    }
  }

})
