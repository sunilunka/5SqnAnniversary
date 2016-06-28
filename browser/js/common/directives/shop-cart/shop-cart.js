app.directive("shopCart", function(ShopifyService){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/shop-cart/shop-cart.html",
    scope: {},
    link: function(scope, element, attrs){
      scope.showItems = false;
      console.log("SHOPPING CART: ", ShopifyService.getCart());
      var cart = ShopifyService.getCart();
      scope.itemCount = cart.lineItemCount;
      scope.items = cart.lineItems;

      scope.toggleShowItems = function(){
        scope.showItems = !scope.showItems;
      }

    }
  }
})
