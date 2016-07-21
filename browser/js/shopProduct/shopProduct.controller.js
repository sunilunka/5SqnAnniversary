app.controller("ShopProductCtrl", function($scope, ShopFactory, Product, ShopService, $timeout){

  $scope.product = Product;

  $scope.quantity = 1;

  $scope.selectedVariant = {};

  $scope.notAvailable = false

  var determineAvailable = function(stock){
    if(stock > 0){
      $scope.notAvailable = false;
    } else {
      $scope.notAvailable = true;
    }
  }

  var setAvailable = function(){
    if(!$scope.product.variants.length){
      return determineAvailable($scope.product.stock);
    } else {
      return determineAvailable($scope.selectedVariant.stock);
    }
  }

  setAvailable();


})
