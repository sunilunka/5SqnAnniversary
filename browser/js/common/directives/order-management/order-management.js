app.directive("orderManagement", function(OrderFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/order-management/order-management.html",
    scope: {
      order: "="
    },
    link: function(scope, element, attrs){

      scope.orderIsUpdating = false

      scope.trackingData = null;

      scope.paymentState = ["pending", "paid"];

      scope.orderState = ["received", "dispatched", "collected"]

      var updateOrder = function(orderId, orderObj){
        scope.orderIsUpdating = true;
        return OrderFactory.updateOrder(orderId, orderObj)
        .then(function(data){
          angular.copy(data, scope.order);
          scope.orderIsUpdating = false;
        })
      }

      scope.updateOrderStatus = function(value){
        updateOrder(scope.order._id, {
          orderStatus: value
        })
      }

      scope.updateOrderPayment = function(value){
        updateOrder(scope.order._id, {
          paymentState: value
        })
      }

      scope.cancelOrder = function(){
        updateOrder(scope.order._id, {
          orderStatus: "cancelled"
        })
      }

      scope.addTrackingData = function(){
        updateOrder(scope.order._id, {
          trackingData: scope.order.trackingData
        })
      }

      var init = function(){
        if(scope.order['trackingData']){
          scope.trackingData = scope.order.trackingData;
        }
      }

      init();

    }
  }
})
