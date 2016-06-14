app.directive("userPlatforms", function(){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/user-platforms/user-platforms.html",
    scope: {
      platforms: "=",
      userdata: "="
    },
    link: function(scope, element, attrs){

      let platformKeys = Object.keys(scope.userdata);

      var nameArray = platformKeys.map(function(pkey){
          return scope.platforms[pkey].label;
      })

      scope.parsedPlatforms = nameArray;

    }
  }
})
