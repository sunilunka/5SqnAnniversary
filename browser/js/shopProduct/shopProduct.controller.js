app.controller("ShopProductCtrl", function($scope, ShopifyFactory, shopProduct, ShopifyService){

  $scope.product = shopProduct;

  $scope.quantity = 1;

  $scope.addProductToCart = function(){
    ShopifyService.addToCart({
      variant: $scope.product.selectedVariant,
      quantity: $scope.quantity
    });
  }

})
