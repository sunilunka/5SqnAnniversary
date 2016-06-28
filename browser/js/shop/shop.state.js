app.config(function($stateProvider){
  $stateProvider.state("shopFront", {
    url: "/shop",
    templateUrl: "js/shop/shop.html",
    controller: "ShopCtrl",
    resolve: {
      collectionProducts: function(ShopifyFactory){
        return ShopifyFactory.getCollectionProducts(310317511);
      }
    }
  })
})
