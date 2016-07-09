app.controller("ManagementShopCtrl", function($scope, ShopManagementFactory){

  $scope.newProduct = {};

  $scope.addProductOptions = false;

  $scope.noProductOptions = false;

  $scope.addNewProduct = function(){
    console.log("SCOPE NEW PRODUCT: ", $scope.newProduct);
  }

  $scope.addOptions = function(){
    event.preventDefault();
    $scope.productOptions = true;
  }

  $scope.noOptions = function(){
    event.preventDefault();
  }

  $scope.resetFormAndClose = function(){
    event.preventDefault();
    angular.copy({}, $scope.newProduct);
  }


})
