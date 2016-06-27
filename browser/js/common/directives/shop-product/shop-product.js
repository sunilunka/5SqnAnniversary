app.directive("shopProduct", function(ShopifyService, ShopifyFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/shop-product/shop-product.html",
    scope: {
      product: "="
    },
    link: function(scope, element, attrs){
      var product = scope.product;
      scope.title = product.title;
      scope.image = product.images[0];
      console.log("PRODUCT DETAILS: ", product);

    }
  }
})
