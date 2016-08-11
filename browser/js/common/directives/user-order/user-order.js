app.directive("userOrder", function(OrderFactory, $rootScope){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/user-order/user-order.html",
    scope: {
      order: "="
    },
    link: function(scope, element, attrs){

      scope.viewOrder = function(){
        $rootScope.$broadcast("viewOrder", scope.order);
      }

    }
  }
})
