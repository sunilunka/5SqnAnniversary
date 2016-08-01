app.directive("orderManagement", function(OrderFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/order-management/order-management.html",
    scope: {
      order: "="
    },
    link: function(scope, element, attrs){

      scope.orderIsUpdating = false

      scope.paymentState = ["pending", "paid"];

      scope.orderState = ["received", "dispatched", "collected"]

      scope.updateOrderStatus = function(stat){
        scope.orderIsUpdating = true;
        OrderFactory.updateOrder(scope.order._id, {
          orderStatus: stat
        })
        .then(function(data){
          angular.copy(data, scope.order);
          scope.orderIsUpdating = false;
        })
      }

      scope.updateOrderPayment = function(stat){

      }

    }
  }
})
