app.controller("ShopOrderAmendCtrl", function($scope, OrderService){

  $scope.order;

  $scope.initFailed = false;

  $scope.orderNotValid = true;

  var refreshScope = function(order){
    angular.merge(order, $scope.order);
    OrderService.checkAllQuantitiesCleared(function(notValid){
      console.log("NOT VALID: ", notValid)
      $scope.orderNotValid = notValid;
    })
  }

  $scope.acceptNewQuantity = function(item){
    OrderService.amendOrderItem(item, refreshScope);
  }

  $scope.removeItem = function(item){
    OrderService.removeItem(item, refreshScope);
  }


  var init = function(){
    var keys = Object.keys(OrderService.getOrder());
    if(keys){
      $scope.order = OrderService.getOrder();
      console.log("SCOPE ORDER: ", $scope.order);
    } else {
      scope.initFailed = true;
    }
  }

  init();

})
