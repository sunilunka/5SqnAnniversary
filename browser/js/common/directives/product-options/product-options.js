app.directive("productOptions", function(){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/product-options/product-options.html",
    scope: {
      option: "="
    },
    link: function(scope, element, attrs){

      scope.label = "Edit"

      scope.editInProgress = false;

      scope.toggleEdit = function(event){
        event.preventDefault();
        if(!scope.editInProgress){
          scope.editInProgress = true;
          scope.label = "Save";
        } else {
          scope.option.transformChoicesToArray();
          scope.editInProgress = false;
          scope.label = "Edit";
        }
      }

      scope.removeOption = function(event){
        event.preventDefault();
        _.pull(scope.$parent.newProductOptions, scope.option);
      }

    }
  }
})
