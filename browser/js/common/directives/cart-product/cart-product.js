app.directive("cartProduct", function(ShopService){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/cart-product/cart-product.html",
    scope: {
      lineitem: "="
    },
    link: function(scope, element, attrs){
      console.log("LINE ITEM: ", scope.lineitem)
      scope.processingUpdate = false;
      scope.removeCartItem = function(){
        ShopService.removeCartItem(scope.lineitem._id);
      }

      scope.updateQuantity = function(quantityModValue){
        /* Set this to true to disable the buttons, to inhibit multiple clicks before promise resolves */
        scope.processingUpdate = true;
        let newQuantity = scope.lineitem.quantity;
        if(quantityModValue === "increment"){
          newQuantity += 1;
        } else if("decrement"){
          newQuantity -= 1;
        }
        ShopService.updateCartItem(scope.lineitem._id, newQuantity)
        scope.processingUpdate = false;
      }
    }
  }
})
