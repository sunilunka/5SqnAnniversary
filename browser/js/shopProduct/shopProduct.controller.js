app.controller("ShopProductCtrl", function($scope, ShopFactory, Product, ShopService, $timeout){

  $scope.product = Product;

  $scope.quantity = 1;

  $scope.selectedOptions = {};

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

  $scope.updateSelectedVariant = function(option, value){
    $scope.selectedVariant[option] = value;
  }

  $scope.addProductToCart = function(){
    var selectedVariantValid = Object.keys($scope.selectedVariant).length
    if(!selectedVariantValid){
      // Convert and add product to cart
      ShopService.getCart().addItemToCart($scope.product, $scope.quantity)
    } else {
      // Convert and add $scope.selectedVariant to cart
      ShopService.getCart().addItemToCart($scope.selectedVariant, $scope.quantity);
    }
  }

})
