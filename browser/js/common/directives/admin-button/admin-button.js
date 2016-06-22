app.directive("adminButton", function(ManagementFactory, AuthService, NotificationService, $timeout){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/admin-button/admin-button.html",
    scope: {
      user: "="
    },
    link: function(scope, element, attrs){

      scope.isManager = false;

      scope.addToManagement = function(){
        return ManagementFactory.addManager(scope.user.$id)
        .then(function(data){
          NotificationService.notify("success", scope.user.firstName + " is now a manager")
        })
      }

      scope.removeFromManagement = function(){
        return ManagementFactory.removeManager(scope.user.$id)
        .then(function(){
          NotificationService.notify("success", scope.user.firstName + " has been removed from managers")
        })
      }

      ManagementFactory.watchManagementState(scope.user.$id, function(managementState){
        if(managementState){
          scope.isManager = true;
        } else {
          scope.isManager = false;
        }
        $timeout(function(){
          scope.$apply();
        },1);

      })
    }
  }
})
