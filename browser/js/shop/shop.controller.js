app.controller("ShopCtrl", function($scope, ShopService, ShopFactory, Products, $rootScope){

  $scope.products = Products;

  $rootScope.$broadcast("shopLoadComplete");
})
