app.directive("userManagementPanel", function(AttendeeFactory, ManagementFactory, GuestCategoryFactory, NotificationService){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/user-management-panel/user-management-panel.html",
    scope: {
      user: "="
    },
    link: function(scope, element, attrs){

      let user = scope.user;

      scope.deleteUser = function(){
        /* Store userId so that it can be shown to admin to help them identify and remove the authentication of the user as well. */
        let userId = scope.user.$id;
        return AttendeeFactory.removeUser(scope.user)
        .then(function(data){
          NotificationService.notify("success", "User " + userId + "has been removed. Remember to remove them from the auth panel.");
          return userId;
        })
        .catch(function(error){
          NotificationService.notify("error", "Sorry an error occured: " + error.message);
          return error;
        })
      }

      scope.$watch(function(){
        return scope.user
      }, function(newValue, oldValue){
        GuestCategoryFactory.resolveName(user.association, function(name){
          scope.association = name;
          scope.$apply();
        })
      })

    }
  }
})
