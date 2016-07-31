app.controller("ShopOrderSuccessCtrl", function($scope, Order){
  console.log("ORDER: ", Order);
  $scope.order = Order;

})
