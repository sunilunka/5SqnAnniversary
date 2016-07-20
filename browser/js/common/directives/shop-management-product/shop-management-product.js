app.directive("shopManagementProduct", function(ShopManagementFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/shop-management-product/shop-management-product.html",
    scope: {
      product: "="
    },
    link: function(scope, element, attrs){
      scope.removeProduct = function(event){
        event.preventDefault();
        return ShopManagementFactory.removeProduct(scope.product._id)
        .then(function(response){
          if(response.status === 204){
            element.remove();
          }
        })
      }
    }
  }
})
