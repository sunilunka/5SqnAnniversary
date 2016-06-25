app.factory("ShopifyFactory", function(ShopifyService){


  var ShopifyFactory = {};

  ShopifyFactory.getCollectionProducts = (collectionId) => {
    return ShopifyService.shopClient.fetchQueryProducts({collection_id: collectionId })
    .then(function(products){
      return products;
    })
  }
  return ShopifyFactory;

})
