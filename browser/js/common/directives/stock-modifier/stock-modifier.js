app.directive("stockModifier", function(ShopManagementFactory, $timeout){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/stock-modifier/stock-modifier.html",
    scope: {
      item: "="
    },
    link: function(scope, element, attrs){
      scope.editingStock = false;
      scope.editLabel = "Modify Stock"

      scope.nostock = false;

      scope.displayOptions;

      scope.toggleModifyStock = function(){
        if(scope.editingStock){
          scope.editingStock = false;
          scope.editLabel = "Modify Stock"
          scope.modAmount = null;
        } else {
          scope.editingStock = true;
          scope.editLabel = "Cancel"
        }
      }

      var processResult = function(responseData){
        angular.copy(responseData, scope.item);
        scope.modAmount = null;
        if(responseData["nostock"]){
          scope.nostock = true;
          $timeout(function(){
            scope.nostock = false;
            delete scope.item.nostock;
          }, 2000)
        }
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

      var init = function(){
        var variantDisplay = [];
        if(scope.item["options"]){
          for(var variant in scope.item.options){
            variantDisplay.push(scope.item.options[variant]);
          }

          variantDisplay = variantDisplay.join(" / ");

          scope.displayOptions = variantDisplay;
        }
      }

      init();
    }
  }
})
