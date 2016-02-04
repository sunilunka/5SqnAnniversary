app.directive("headerBar", function(){

  return {
    restrict: 'E',
    templateUrl: "/js/common/directives/header-bar/header-bar.html",
    scope: {},
    link: function(scope){
      scope.links = [
        {title: "Home", state: "home"},
        {title: "About Us", state: "about"},
        {title: "Anniversary", state: "newAttendee"}
      ]
    }
  }

})
