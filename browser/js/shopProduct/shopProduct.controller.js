app.controller("ShopProductCtrl", function($scope, ShopFactory, Product, ShopService, $timeout){

  $scope.product = Product;

  $scope.quantity = 1;

  $scope.selectedVariant = {};
})
