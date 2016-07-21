app.factory("ShopFactory", function(DatabaseFactory, ShopService, ShopManagementFactory){


  var ShopFactory = {};

  ShopFactory.getProduct = function(productId){
    console.log("PRODUCT ID: ", productId);
    return ShopManagementFactory.getProduct(productId);
  }


  return ShopFactory;

})
