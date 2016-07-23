app.directive("shopCart", function(ShopService, $rootScope, $timeout){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/shop-cart/shop-cart.html",
    scope: {},
    link: function(scope, element, attrs){

      ShopService.checkForLocalCartOnInit();

      var cart = ShopService.getCart();

      var updateCart = function(){
        cart = ShopService.getCart();
        scope.itemCount = cart.lineItemCount;
        scope.subTotal = cart.subtotal;
        angular.copy(cart.lineItems, scope.items)
        $timeout(function(){
          scope.$apply()
        }, 1);

      }

      scope.showItems = false;
      scope.showItemLabel = "Show/Modify your items"
      console.log("SHOPPING CART: ", ShopService.getCart());
      scope.itemCount = 0;
      scope.items =[];
      scope.subTotal  = "0.00";

      if(cart){
        updateCart(cart);
      }

      $rootScope.$on("updatedCart", function(event, value){
        updateCart();
      })


      scope.toggleShowItems = function(){
        scope.showItems = !scope.showItems;
        if(scope.showItems){
          scope.showItemLabel = "Close item list";
        } else {
          scope.showItemLabel = "Show/Modify your items";
        }
      }

      scope.checkoutCart = function(){

      }
    }
  }
})
