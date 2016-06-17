app.directive("userPlatforms", function(PlatformsFactory, $timeout){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/user-platforms/user-platforms.html",
    scope: {
      userdata: "="
    },
    link: function(scope, element, attrs){

      let platformKeys = Object.keys(scope.userdata);

      scope.parsedPlatforms = [];

      PlatformsFactory.resolvePlatformName(platformKeys, function(data){
        angular.copy(data, scope.parsedPlatforms);
        $timeout(function(){
          scope.$apply();
        }, 1)
        return;
      })
    }
  }
})
