app.directive("cartProduct", function(ShopifyService){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/cart-product/cart-product.html",
    scope: {
      lineitem: "="
    },
    link: function(scope, element, attrs){
      console.log("LINE ITEM: ", scope.lineitem)
      scope.removeCartItem = function(){
        ShopifyService.removeCartItem(scope.lineitem.id);
      }

      scope.updateQuantity = function(quantityModValue){
        let newQuantity = scope.lineitem.quantity;
        if(quantityModValue === "increment"){
          newQuantity += 1;
        } else if("decrement"){
          newQuantity -= 1;
        }
        ShopifyService.updateCartItem(scope.lineitem.id, newQuantity)
        .then(function(updatedCart){
          console.log("VARIANT UPDATED IN CART: ", updatedCart);
        })
      }
    }
  }
})
