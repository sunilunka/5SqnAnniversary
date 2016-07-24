app.controller("ShopProductCtrl", function($scope, ShopFactory, Product, ShopService, $timeout){

  $scope.product = Product;

  if($scope.product.variants.length){
    $scope.selectedVariant = $scope.products.variants[0];
    $scope.selectedOptions = $scope.selectedVariant.options;
  }

  $scope.quantity = 1;

  $scope.selectedOptions = {};

  $scope.selectedVariant = {};

  $scope.stockIndicator = "In Stock"

  $scope.notAvailable = false

  var determineAvailable = function(stock){
    if(stock > 0){
      $scope.notAvailable = false;
    } else {
      $scope.notAvailable = true;
    }
    $scope.stockIndicator =  ShopFactory.setStockIndicator(stock)
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
    $scope.selectedOptions[option] = value;
    setAvailable()
  }

  $scope.addProductToCart = function(){
    var selectedVariantValid = Object.keys($scope.selectedVariant).length
    if(!selectedVariantValid){
      // Convert and add product to cart
      ShopService.addToCart($scope.product, $scope.quantity)
    } else {
      // Convert and add $scope.selectedVariant to cart
      ShopService.addToCart($scope.selectedVariant, $scope.quantity);
    }
  }

})
