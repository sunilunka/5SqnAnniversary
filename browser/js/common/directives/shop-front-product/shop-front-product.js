app.directive("shopFrontProduct", function(ShopifyService, ShopifyFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/shop-front-product/shop-front-product.html",
    scope: {
      product: "="
    },
    link: function(scope, element, attrs){
      var product = scope.product;
      var selectedVar = scope.product.selectedVariant;
      scope.title = product.title;
      scope.imageSrc = product.images[0].src;
      scope.price = selectedVar.price;
      console.log("PRODUCT DETAILS: ", product);


    }
  }
})
