app.controller("ManagementShopOrdersCtrl", function($scope, allOrders, OrderFactory){

  $scope.orders = allOrders;

  $scope.noOrders = true;

  $scope.processingQuery = false;

  $scope.currentView = "All";

  $scope.viewOptions = [{
    key: "all",
    name: "All",
    value: "all"
  },
  {
    key: "paymentState",
    name: "Paid",
    value: "paid"
  },
  {
    key: "paymentState",
    name: "Payment Pending",
    value: "pending"
  }];

  var processQueryOutput = function(results){
    $scope.orders = results;
    $scope.processingQuery = false;
  }

  $scope.getQueryOrders = function(valueObj){
    $scope.processingQuery = true;
    $scope.currentView = valueObj.name;
    if(valueObj.value === "all"){
      OrderFactory.getAllOrders()
      .then(processQueryOutput)
    } else {
      var query = {};
      query[valueObj.key] = valueObj.value;
      OrderFactory.getAllOrders(query)
      .then(processQueryOutput)
    }
  }

  $scope.filterParams = {};

  $scope.findOrderNumber = function(){
    if($scope.orderRef){
      $scope.filterParams['order_ref'] = "5SQN-75-" + $scope.orderRef;
    }
  }


})
