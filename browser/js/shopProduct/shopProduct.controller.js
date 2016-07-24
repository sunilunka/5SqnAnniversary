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
  } else {
    $scope.stock = $scope.product.stock;
    $scope.imageToShow = $scope.product.imageURL
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

  $timeout(function(){
    $scope.$apply();
  }, 1)

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
      if(findVariant(variant.options, options)){
        return variant;
      }
    })
    if(results.length){
      return results[0];
    } else {
    /* If no matching variant is found, populate the selectedVariant with a 'phantom' placeholder with no stock. This prevents users from selecting it. Will implement better logic in the future. */
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

  var stringifyOptions = function(optionObj){
    var forDisplay = "";
    for(var opt in optionObj){
      if(forDisplay.length){
         var optToString = " / " + _.capitalize(opt) + ": " + optionObj[opt];
         forDisplay = forDisplay + optToString;
      } else {
        forDisplay = forDisplay + _.capitalize(opt) + ": " + optionObj[opt]
      }
    }
    return forDisplay;
  }

  var convertVariantToCartObject = function(variant){
    variant.title = $scope.product.title;
    variant.display_options = stringifyOptions(variant.options);
    /* Other product/variant agnostic processing done by addItemToCart method on cart object. */
    return variant;
  }

  $scope.addProductToCart = function(){
    var selectedVariantValid = Object.keys($scope.selectedVariant).length
    if(!selectedVariantValid){
      // Convert and add product to cart
      ShopService.addToCart($scope.product, $scope.quantity)
    } else {
      // Modify variant with details required for order form.
      var cartObject = {};
      angular.copy($scope.selectedVariant, cartObject);
      ShopService.addToCart(convertVariantToCartObject(cartObject), $scope.quantity);
      $scope.quantity = 1;
    }
  }

})
