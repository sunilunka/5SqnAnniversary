app.controller("ShopProductCtrl", function($scope, ShopifyFactory, shopProduct, ShopifyService){

  $scope.product = shopProduct;

  $scope.quantity = 1;

  var getSelectedOption = function(option){
    return $scope.product.options.filter(function(opt){
      return opt.name === option.name;
    })[0];
  }

  $scope.updateSelectedVariant = function(option, newValue){
    // option.selected = newValue;
    option.value = newValue;
    option.selected = newValue;
    console.log("OPTION VALUE: ", option);
    return option;
  }

  $scope.addProductToCart = function(){
    console.log("PRODUCT VARIANT: ", $scope.product.selectedVariant);
    ShopifyService.addToCart({
      variant: $scope.product.selectedVariant,
      quantity: $scope.quantity
    })
  }

})
