app.controller("ShopCheckoutCtrl", function($scope, ShopService, ShopFactory){



  $scope.order = {};

  $scope.deliverable = false;

  $scope.submitOrder = function(){
    
    console.log("ORDER TO SUBMIT: ", $scope.order);
  }

  var init = function(){
    ShopService.checkForLocalCartOnInit();
    angular.copy(ShopService.getCart(), $scope.order);
    $scope.deliverable = ShopFactory.checkAllDeliverable($scope.order.products);

  }

  init();

})
