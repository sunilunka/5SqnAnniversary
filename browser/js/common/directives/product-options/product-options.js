app.directive("productOptions", function(){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/product-options/product-options.html",
    scope: {
      option: "="
    },
    link: function(scope, element, attrs){
      console.log("SCOPE OPTION: ", scope.option);

      scope.label = "Edit"

      scope.editInProgress = false;

      scope.toggleEdit = function(){
        event.preventDefault();
        event.stopPropagation();
        if(!scope.editInProgress){
          scope.editInProgress = true;
          scope.label = "Save";
        } else {
          scope.option.transformChoicesToArray();
          scope.editInProgress = false;
          scope.label = "Edit";
        }
      }
    }
  }
})
