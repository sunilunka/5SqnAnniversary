app.directive("stockModifier", function(){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/stock-modifier/stock-modifier.html",
    scope: {
      item: "="
    },
    link: function(scope, element, attrs){
      scope.editingStock = false;

      scope.toggleModifyStock = function(){
        if(scope.editingStock){
          scope.editingStock = false;
        } else {
          scope.editingStock = true;
        }
      }

      scope.addStock = function(event){
        event.preventDefault();
      }

      scope.removeStock = function(event){
        event.preventDefault();
      }

    }
  }
})
