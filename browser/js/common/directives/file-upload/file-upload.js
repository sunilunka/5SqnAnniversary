app.directive('fileUpload', function($timeout){
  return {
    restrict: "A",
    link: function(scope, element, attrs){
      var fileReader = new FileReader();
      element.bind("change", function(event){
        scope.assetToUpload = event.target.files[0];
        $timeout(function(){
          scope.$apply();
        }, 1)
      })
    }
  }
})
