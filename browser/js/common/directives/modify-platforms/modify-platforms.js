app.directive("modifyPlatforms", function(PlatformsFactory, NotificationService){
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
        /* Disabled on template, please enable when full removal protocol is established. */
        scope.isEditing = !scope.isEditing;
        PlatformsFactory.removePlatform(scope.platform)
        .then(function(ref){
          NotificationService.notify("success", "Platform removed.");
        })
        .catch(function(error){
          NotificationService.notify("error", "Sorry, an error occured, platform may not have been removed.");
        })
      }
    }
  }
})
