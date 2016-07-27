app.factory("OrderFactory", function($http){

  var OrderFactory = {};

  OrderFactory.submitToServer = function(order){
    return $http.post("http://127.0.0.1:3000/api/orders/new", order)
    .then(function(response){
      if(response.status === 200){
        $state.go("shopOrderAmend")
      } else if(response.status === 201){
        $state.go("shopOrderSuccess", {orderId: response.body.order_ref }); 
      }
    })
  }



  return OrderFactory;

})
