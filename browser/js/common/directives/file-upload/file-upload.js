app.directive('fileUpload', function($parse, $timeout){
  return {
    restrict: "A",
    link: function(scope, element, attrs){
      var fileReader = new FileReader();
      element.bind("change", function(event){
        console.log("ELEMENT HAS CHANGED: ", event.target.files[0]);
        scope.upload = event.target.files[0];
        fileReader.readAsDataURL(event.target.files[0]);
        fileReader.addEventListener("loadend", function(e){
          console.log("RESULT: ", scope);
        })
        $timeout(function(){
          scope.$apply();
        }, 1)
      })
    }
  }
})
