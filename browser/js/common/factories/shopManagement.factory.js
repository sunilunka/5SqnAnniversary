app.factory("ShopManagementFactory", function(DatabaseFactory, $firebaseArray){

  var shopProductRef = DatabaseFactory.dbConnection("shop/products");

  var ShopManagementFactory = {};


  ShopManagementFactory.getAllProducts = function(){
    return $firebaseArray(shopProductRef);
  }



  return ShopManagementFactory;

})
