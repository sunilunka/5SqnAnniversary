app.directive("cartProduct", function(ShopifyService){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/cart-product/cart-product.html",
    scope: {
      lineitem: "="
    },
    link: function(scope, element, attrs){
      scope.removeCartItem = function(){
        ShopifyService.removeCartItem(scope.lineitem.id);
      }
    }
  }
})
