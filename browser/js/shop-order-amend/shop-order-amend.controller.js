app.controller("ShopOrderAmendCtrl", function($scope, OrderService){

  $scope.order;

  $scope.initFailed = false;

  $scope.orderNotValid = true;

  $scope.processing = false;

  var refreshScope = function(order){
    angular.merge(order, $scope.order);
    OrderService.checkAllQuantitiesCleared(function(notValid){
      $scope.orderNotValid = notValid;
    })
  }

  $scope.acceptNewQuantity = function(item){
    OrderService.amendOrderItem(item, refreshScope);
  }

  $scope.removeItem = function(item){
    OrderService.removeItem(item, refreshScope);
  }

  $scope.cancelOrder = function(){
    OrderService.cancelOrder();
  }

  $scope.submitOrder = function(){
    OrderFactory.submitToServer($scope.order);
  }


  var init = function(){
    var keys = Object.keys(OrderService.getOrder()).length;
    if(keys){
      $scope.order = OrderService.getOrder();
    } else {
      $scope.initFailed = true;
    }
  }

  init();

})
