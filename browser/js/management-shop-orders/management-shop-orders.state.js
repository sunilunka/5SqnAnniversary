app.config(function($stateProvider){
  $stateProvider.state("managementOrders", {
    url: "/management/orders",
    templateUrl: "js/management-shop-orders/management-shop-orders.html",
    controller: "ManagementShopOrdersCtrl",
    data: {
      authRequired: true,
      adminRequired: true
    },
    resolve: {
      allOrders: function(OrderFactory){
        return OrderFactory.getAllOrders();
      }
    }
  })
})
