app.controller("ShopProductCtrl", function($scope, ShopFactory, Product, ShopService, $timeout){

  $scope.product = Product;

  $scope.quantity = 1;

  $scope.selectedOptions = {};

  $scope.selectedVariant = {};

  $scope.stockIndicator = "In Stock"

  $scope.stock = 0;

  $scope.notAvailable = false

  if($scope.product.variants.length){
    angular.copy($scope.product.variants[0], $scope.selectedVariant)
    angular.copy($scope.selectedVariant.options, $scope.selectedOptions);
    $scope.stock = $scope.selectedVariant.stock;
    $scope.imageToShow = ($scope.selectedVariant.imageURL || $scope.product.imageURL);
    console.log("SELECTED OPTIONS: ", $scope.selectedVariant)
    $timeout(function(){
      $scope.$apply();
    }, 1)
  }


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

  var findVariant = function(variantOptionsObj, options){
    for(var opt in variantOptionsObj){
      if(options[opt] !== variantOptionsObj[opt]){
        return false;
      }
      return true;
    }
  }

  var findAndSelectVariant = function(variantArray, options){
    var results = variantArray.filter(function(variant){
      console.log("FIND VARIANT: ", findVariant(variant.options, options));
      if(findVariant(variant.options, options)){
        return variant;
      }
    })
    if(results.length){
      return results[0];
    } else {
    /* If no matching variant is found, populate the selectedVariant with a 'phantom' placeholder with no stock. */
      return {
        options: options,
        stock: 0
      }
    }
  }

  $scope.updateSelectedVariant = function(name, value){
    $scope.selectedOptions[name] = value;
    angular.copy(findAndSelectVariant($scope.product.variants, $scope.selectedOptions), $scope.selectedVariant);
    $scope.stock = $scope.selectedVariant.stock;
    $scope.imageToShow = ($scope.selectedVariant.imageURL || $scope.product.imageURL);
    setAvailable()
    $timeout(function(){
      $scope.$apply();
    }, 1)
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
