app.directive("orderManagement", function(){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/order-management/order-management.html",
    scope: {
      order: "="
    },
    link: function(scope, element, attrs){

    }
  }
})
