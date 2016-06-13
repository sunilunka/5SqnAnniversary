app.directive("userManagementPanel", function(AttendeeFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/user-management-panel/user-management-panel.html",
    scope: {
      user: "="
    },
    link: function(scope, element, attrs){
      
    }
  }
})
