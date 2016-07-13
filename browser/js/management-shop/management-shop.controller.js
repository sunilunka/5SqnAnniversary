app.controller("ManagementShopCtrl", function($scope, ShopManagementFactory){

  $scope.newProduct = {};

  $scope.addProductOptions = false;

  $scope.noProductOptions = false;

  $scope.addVariants = false;

  $scope.newProductOptions = [];

  $scope.addNewProduct = function(){
    console.log("SCOPE NEW PRODUCT: ", $scope.newProduct);
    // ShopManagementFactory.addNewProduct($scope.newProduct);
  }

  $scope.addOptions = function(){
    event.preventDefault();
    $scope.addProductOptions = true;
    $scope.noProductOptions = false;
  }

  $scope.addVariants = function(){
    
  }

  $scope.populateOptionArray = function(){
    event.preventDefault();
    var toPush = ShopManagementFactory.convertToOptionObj($scope.newOption);
    $scope.newProductOptions.push(toPush);
    angular.copy({}, $scope.newOption);
    console.log("NEW PRODUCT OPTIONS: ", $scope.newProductOptions);
  }


  $scope.noOptions = function(){
    event.preventDefault();
    $scope.noProductOptions = true;
    $scope.productOptions = false;
    angular.copy([{}], $scope.newProduct.options)
  }

  $scope.resetFormAndClose = function(){
    event.preventDefault();
    angular.copy({}, $scope.newProduct);
  }


})
