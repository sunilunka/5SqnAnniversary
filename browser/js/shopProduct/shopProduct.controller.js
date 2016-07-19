app.controller("ShopProductCtrl", function($scope, ShopifyFactory, shopProduct, ShopifyService, $timeout){

  $scope.product = shopProduct;

  $scope.quantity = 1;

  $scope.selectedVariant;

  $scope.notAvailable = false;

  var getSelectedVariant = function(option){
    
  }

  var setSelectedVariantAvailable = function(product){
    if(!$scope.product.selectedVariant || !$scope.product.selectedVariant.attrs.variant.available){
      $scope.notAvailable = true;
    } else {
      $scope.notAvailable = false;
    }
  }

  $scope.updateSelectedVariant = function(option, newValue){
    // option.selected = newValue;
    option.value = newValue;
    option.selected = newValue;
    setSelectedVariantAvailable($scope.product);
    // angular.copy($scope.optionObject[option.name][newValue], $scope.availableVars[option.name]);
    // console.log("AVAILABLE VARIANTS: ", $scope.availableVars);
    return option;
  }

  var setSelectedOptionsOnLoad = function(product){
    product.options.forEach(function(option){
      option.value = option.selected;
      // $scope.availableVars[option.name] = [];
    })
    setSelectedVariantAvailable(product)
  }

  setSelectedOptionsOnLoad($scope.product);

  $scope.addProductToCart = function(){
    ShopService.addToCart({
      variant: $scope.product.selectedVariant,
      quantity: $scope.quantity
    })
  }

})
