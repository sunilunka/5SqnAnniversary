app.config(function($stateProvider){
  $stateProvider.state("shopOrderSuccess", {
    url: "/order/:orderId/success",
    templateUrl: "js/shop-order-success/shop-order-success.html",
    controller: "ShopOrderSuccessCtrl",
    resolve: {
      Order: function(OrderFactory, $stateParams){
        return OrderFactory.getOneOrder($stateParams.orderId);
      }
    }
  })
})
