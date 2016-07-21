app.config(function($stateProvider){
  $stateProvider.state("shopProduct", {
    url: "/shop/product/:productId",
    templateUrl: "js/shopProduct/shopProduct.html",
    controller: "ShopProductCtrl",
    resolve: {
      Product: function(ShopFactory, $stateParams){
        return ShopFactory.getProduct($stateParams.productId);
      }
    }
  })
})
