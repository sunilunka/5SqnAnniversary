app.directive("userManagementPanel", function(AttendeeFactory, ManagementFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/user-management-panel/user-management-panel.html",
    scope: {
      user: "=",
      platforms: "=",
      evts: "=",
      categories: "="
    },
    link: function(scope, element, attrs){

      let user = scope.user;

      scope.association = scope.categories[user.association];

      scope.deleteUser = function(){
        /* Store userId so that it can be shown to admin to help them identify and remove the authentication of the user as well. */
        let userId = scope.user.$id;
        return AttendeeFactory.removeUser(scope.user)
        .then(function(data){
          console.log("USER REMOVED: ", userId);
          return userId;
        })
        .catch(function(error){
          console.log("SORRY AN ERROR OCCURED: ", error);
          return error;
        })
      }



    }
  }
})
