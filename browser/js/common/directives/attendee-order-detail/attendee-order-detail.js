app.directive("attendeeOrderDetail", function($rootScope){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/attendee-order-detail/attendee-order-detail.html",
    scope: {},
    link: function(scope, element, attrs){

      scope.orderDetails = {};

      $rootScope.$on("viewOrder", function(event, orderData){
          angular.copy(orderData, scope.orderDetails);
          element.addClass("show-order-details");
      })

      scope.closeOrderView = function(){
        element.removeClass("show-order-details");
      }
    }
  }
})
