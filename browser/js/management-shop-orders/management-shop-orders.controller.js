app.controller("ManagementShopOrdersCtrl", function($scope, allOrders){

  $scope.orders = allOrders;

  $scope.noOrders = true;

  $scope.processingQuery = false;

  $scope.currentView = "All";

  $scope.viewOptions = [{
    key: "all",
    name: "All"
  },
  {
    key: "paymentState",
    name: "Paid"
  },
  {
    key: "paymentState",
    name: "Payment Pending"
  }];

  $scope.setOrderView = function(valueObj){
    $scope.currentView = valueObj.name;
  }

  $scope.filterParams = {};

  $scope.findOrderNumber = function(){
    if($scope.orderRef){
      $scope.filterParams['order_ref'] = "5SQN-75-" + $scope.orderRef;
    }
  }

  $scope.getOrderQueryResults = function(valueObj){

  }

})
