app.controller("ShopProductCtrl", function($scope, ShopifyFactory, shopProduct){

  $scope.product = shopProduct;

  $scope.quantity = 1;

})
