app.controller("ShopProductCtrl", function($scope, ShopifyFactory, shopProduct, ShopifyService){

  $scope.product = shopProduct;

  $scope.quantity = 1;


  $scope.optionObject = ShopifyFactory.produceLookUpObject($scope.product);

  $scope.availableVars = {};

  var getSelectedOption = function(option){
    return $scope.product.options.filter(function(opt){
      return opt.name === option.name;
    })[0];
  }

  $scope.updateSelectedVariant = function(option, newValue){
    // option.selected = newValue;
    option.value = newValue;
    option.selected = newValue;
    console.log("SELECTED VARIANT: ", $scope.product.selectedVariant);
    angular.copy($scope.optionObject[option.name][newValue], $scope.availableVars[option.name]);
    console.log("AVAILABLE VARIANTS: ", $scope.availableVars);
    return option;
  }

  var setSelectedOptionsOnLoad = function(productOptions){
    productOptions.forEach(function(option){
      option.value = option.selected;
      $scope.availableVars[option.name] = [];
    })
  }

  setSelectedOptionsOnLoad($scope.product.options);

  $scope.addProductToCart = function(){
    ShopifyService.addToCart({
      variant: $scope.product.selectedVariant,
      quantity: $scope.quantity
    })
  }

})
