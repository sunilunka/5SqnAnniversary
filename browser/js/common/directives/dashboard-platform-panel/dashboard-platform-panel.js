app.directive("dashboardPlatformPanel", function(ManagementFactory, EventFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/dashboard-platform-panel/dashboard-platform-panel.html",
    scope: {
      platformdata: "=",
      evts: "="
    },
    link: function(scope, element, attrs){

    }
  }
})
