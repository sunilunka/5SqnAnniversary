app.config(function($stateProvider){
  $stateProvider.state("shopProduct", {
    url: "/shop/product/:productId",
    templateUrl: "js/shopProduct/shopProduct.html",
    controller: "ShopProductCtrl",
    resolve: {
      shopProduct: function(ShopifyFactory, $stateParams){
        return ShopifyFactory.getProduct($stateParams.productId);
      }
    }
  })
})
