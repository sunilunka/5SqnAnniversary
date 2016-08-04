app.directive("stockModifier", function(ShopManagementFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/stock-modifier/stock-modifier.html",
    scope: {
      item: "="
    },
    link: function(scope, element, attrs){
      scope.editingStock = false;
      scope.editLabel = "Modify Stock"

      scope.toggleModifyStock = function(){
        if(scope.editingStock){
          scope.editingStock = false;
          scope.editLabel = "Modify Stock"
        } else {
          scope.editingStock = true;
          scope.editLabel = "Cancel"
        }
      }

      var processResult = function(responseData){
        console.log("RESPONSE DATA: ", responseData)
        angular.copy(responseData, scope.item);
      }

      scope.addStock = function(event){
        event.preventDefault();
        if(scope.item.hasOwnProperty("product_id")){
          ShopManagementFactory.modifyVariantStock(scope.item._id, "add", scope.modAmount)
          .then(processResult)
        } else {
          ShopManagementFactory.modifyProductStock(scope.item._id, "add", scope.modAmount)
          .then(processResult)
        }
      }

      scope.removeStock = function(event){
        event.preventDefault();
        if(scope.item.hasOwnProperty("product_id")){
          ShopManagementFactory.modifyVariantStock(scope.item._id, "subtract", scope.modAmount)
          .then(processResult)
        } else {
          ShopManagementFactory.modifyProductStock(scope.item._id, "subtract", scope.modAmount)
          .then(processResult)
        }
      }

    }
  }
})
