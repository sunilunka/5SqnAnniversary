app.controller("ManagementShopCtrl", function($scope, ShopManagementFactory){

  $scope.newProduct = {
    variants: []
  };
  $scope.newVariant = {
    options: {}
  }

  $scope.addVariants = false;
  $scope.addProductOptions = false;

  $scope.noProductOptions = false;


  $scope.newProductOptions = [];

  $scope.addNewProduct = function(){
    ShopManagementFactory.convertForServer($scope.newProduct, $scope.newProductOptions);
  }

  $scope.resetOptionForm = function(event){
    event.preventDefault();
    angular.copy({}, $scope.newOption);
  }

  $scope.addOptions = function(event){
    event.preventDefault();
    $scope.addProductOptions = true;
    $scope.noProductOptions = false;
    $scope.addVariants = false;
  }

  $scope.openVariants = function(event){
    event.preventDefault();
    $scope.addVariants = true;
    $scope.addProductOptions = false;
    $scope.noProductOptions = false;
  }

  $scope.clearVariants = function(event){
    event.preventDefault();
    $scope.addVariants = false;
    angular.copy([], $scope.newProduct.variants);
  }

  var clearVariantForm = function(){
    var blankVariant = { options: {} };
    angular.copy(blankVariant, $scope.newVariant);
    return;
  }

  $scope.resetVariantForm = function(event){
    event.preventDefault();
    clearVariantForm();
  }

  $scope.populateVariantArray = function(event){
    event.preventDefault();
    console.log("SCOPE NEW VARIANT: ", $scope.newVariant, $scope.newProduct);
    var toSave = {}
    angular.copy($scope.newVariant, toSave);
    $scope.newProduct.variants.push(toSave);
    clearVariantForm();
  }

  $scope.populateOptionArray = function(event){
    event.preventDefault();
    var toPush = ShopManagementFactory.convertToOptionObj($scope.newOption);
    $scope.newProductOptions.push(toPush);
    angular.copy({}, $scope.newOption);
  }


  $scope.noOptions = function(event){
    event.preventDefault();
    $scope.noProductOptions = true;
    $scope.productOptions = false;
    angular.copy([], $scope.newProductOptions)
  }

  $scope.resetFormAndClose = function(event){
    event.preventDefault();
    angular.copy({ variants: [] }, $scope.newProduct);
  }


})
