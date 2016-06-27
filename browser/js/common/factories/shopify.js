app.factory("ShopifyFactory", function(ShopifyService){


  var ShopifyFactory = {};

  ShopifyFactory.getCollectionProducts = (collectionId) => {
    return ShopifyService.shopClient.fetchQueryProducts({collection_id: collectionId })
    .then(function(products){
      return products;
    })
  },

  ShopifyFactory.getProduct = (productId) => {
    return ShopifyService.shopClient.fetchProduct(productId)
    .then(function(product){
      return product;
    })
  }

  return ShopifyFactory;

})
