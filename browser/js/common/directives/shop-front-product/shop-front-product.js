app.directive("shopFrontProduct", function(ShopService, ShopFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/shop-front-product/shop-front-product.html",
    scope: {
      product: "="
    },
    link: function(scope, element, attrs){
      var product = scope.product;
      scope.title = product.title;
      scope.imageSrc = product.imageURL;
      scope.price = (product.price || product.variants[0].price);
      scope.notAvailable = false;

      var init = function(){
        if(scope.stock <= 0){
          scope.notAvailable = true;
        }
      }

      init();

    }
  }
})
