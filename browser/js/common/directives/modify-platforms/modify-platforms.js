app.directive("modifyPlatforms", function(PlatformsFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/modify-platforms/modify-platforms.html",
    scope: {
      platform: "="
    },
    link: function(scope, element, attrs){
      scope.isEditing = false;

      scope.modifiablePlatformObj = {};

      angular.copy(scope.platform, scope.modifiablePlatformObj)

      scope.toggleEdit = () => {
        scope.isEditing = !scope.isEditing;
        if(!scope.isEditing){
          /* If user cancels editing, revert object to original. */
          angular.copy(scope.platform, scope.modifiablePlatformObj)
        }
      }

      scope.updatePlatformLabel = () => {
        /* Come out of editing mode prior to promise resolving to stop further button pushes. */
        scope.isEditing = !scope.isEditing;
        PlatformsFactory.updatePlatform(scope.platform.$id, scope.modifiablePlatformObj.label)
        .then(function(data){
          /* No data is returned from Firebase update. */
        })
      }

      scope.removePlatform = () => {
        scope.isEditing = !scope.isEditing;
        PlatformsFactory.removePlatform(scope.platform)
        .then(function(ref){
          console.log("PLATFORM REMOVED: ", ref);
        })
        .catch(function(error){
          console.log("SORRY AND ERROR OCCURED: ", error);
        })
      }
    }
  }
})
