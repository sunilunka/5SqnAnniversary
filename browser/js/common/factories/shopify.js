app.factory("ShopifyFactory", function(){


  var ShopifyFactory = {};

  ShopifyFactory.shopClient = ShopifyBuy.buildClient({
    apiKey: "726f744d613f29e5d216c147e3bc6770",
    myShopifyDomain: "5-squadron",
    appId: "6"
  });

  ShopifyFactory.shopClient.fetchQueryProducts({collection_id: 310317511 })
  .then(function(collection){
    console.log("COLLECTION: ", collection);
  })
  return ShopifyFactory;

})
