app.factory("OrderFactory", function(DatabaseFactory, $http){

  var OrderFactory = {};

  OrderFactory.submitToServer = function(order){
    return $http.post(DatabaseFactory.generateApiRoute("orders/new"), order)
    .then(function(response){
      if(response.status === 200){
        $state.go("shopOrderAmend")
      } else if(response.status === 201){
        $state.go("shopOrderSuccess", {orderId: response.body.order_ref });
      }
    })
  }

  OrderFactory.getAllOrders = function(userId){
    return $http.get(DatabaseFactory.generateApiRoute("orders"), {
      user_id: userId
    })
    .then(function(orders){
      return orders
    })
  }



  return OrderFactory;

})
