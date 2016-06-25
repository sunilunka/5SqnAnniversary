app.controller("ShopCtrl", function($scope, ShopifyService, ShopifyFactory, collectionProducts){

  // console.log("SHOP CLIENT: ", collectionProducts)
  ShopifyService.createCart();

  // ShopifyFactory.getCollectionProducts(310317511);


  $scope.collectionProducts = collectionProducts;

})
