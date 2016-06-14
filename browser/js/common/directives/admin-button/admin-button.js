app.directive("adminButton", function($rootScope, ManagementFactory, AuthService, NotificationService){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/admin-button/admin-button.html",
    scope: {
      user: "="
    },
    link: function(scope, element, attrs){

      scope.isManager = scope.user.manager;

      scope.addToManagement = function(){
        return ManagementFactory.addManager(scope.user.$id)
        .then(function(data){

          scope.isManager = scope.user.manager;
          NotificationService.createAndBroadcastMessage("success", scope.user.firstName + " is now a manager")
          $rootScope.$digest();
        })
      }

      scope.removeFromManagement = function(){
        return ManagementFactory.removeManager(scope.user.$id)
        .then(function(){
          scope.isManager = scope.user.manager;
          NotificationService.createAndBroadcastMessage("success", scope.user.firstName + " is no longer a manager")
          $rootScope.$digest();
        })
      }

    }
  }
})
