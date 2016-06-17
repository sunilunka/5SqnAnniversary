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

      scope.$watch(function(){
        return scope.userdata;
      }, function(newValue, oldValue){
        platformKeys.forEach(function(pkey){
          return PlatformsFactory.resolvePlatformName(pkey, function(platName){
            scope.parsedPlatforms.push(platName);
            return;
          })
        })
      })


    }
  }
})
