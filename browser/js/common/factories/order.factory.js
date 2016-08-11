app.factory("OrderFactory", function(DatabaseFactory, $http, NotificationService, $state, AuthService, OrderService){

  var OrderFactory = {};

  OrderFactory.submitToServer = function(order){
    return $http.post(DatabaseFactory.generateApiRoute("orders/new"), order)
    .then(function(response){
      if(response.status === 200){
        OrderService.initialize(response.data);
        $state.go("shopOrderAmend")
      } else if(response.status === 201){
        /* Clear shopping cart from sessionStorage */
        if(window.sessionStorage.hasOwnProperty("sqnShopCart")){
          window.sessionStorage.removeItem("sqnShopCart");
        }
        $state.go("shopOrderSuccess", {orderId: response.data._id });
      }
    })
  }

  OrderFactory.getOneOrder = function(id){
    return $http.get(DatabaseFactory.generateApiRoute("orders/" + id))
    .then(function(response){
        return response.data;
    })
    .catch(function(err){
      NotificationService.notify("error", "Sorry an error occured:\n\n" + err.message)
    });
  }

  OrderFactory.checkEmailAgainstAttendees = function(userEmail){
    var request = {
      method: "GET",
      url: DatabaseFactory.generateApiRoute("users/verifyemail"),
      headers: {
        "Content-Type": "application/json"
      },
      params: {
        email: userEmail
      }
    }
    return $http(request)
    .then(function(response){
      if(response.status === 200){
        return response.data;
      } else {
        return null;
      }
    })
    .catch(function(err){
      NotificationService.notify("error", "Sorry an error occured.");
      return err;
    })
  }

  OrderFactory.getAllOrders = function(query){
    var user = AuthService.getCurrentUser();
    var userId = (user.uid || user.id);


    var req = {
      method: "GET",
      url: DatabaseFactory.generateApiRoute("orders"),
      headers: {
        "Content-Type": "application/json"
      },
      params: {
        user_id: userId
      }
    }

    if(query){
      req.params['search'] = query;
    }
    return $http(req)
    .then(DatabaseFactory.parseHTTPRequest);

  }

  OrderFactory.getAllUserOrders = function(userId){
    var request = {
      method: "GET",
      url: DatabaseFactory.generateApiRoute("users/" + userId + "/orders"),
      headers: {
        "Content-Type": "application/json"
      },
      params: {
        "user_id": userId
      }
    }
    return $http(request)
    .then(DatabaseFactory.parseHTTPRequest);
  }

  OrderFactory.updateOrder = function(orderId, updateObj){
    var req = {
      method: "PUT",
      url: DatabaseFactory.generateApiRoute("orders/" + orderId),
      headers: {
        "Content-Type": "application/json"
      },
      data: updateObj
    }
    return $http(req)
    .then(function(response){
      return response.data;
    })
    .catch(function(err){
      console.error("Sorry an error occured: ", err);
    })
  }


  return OrderFactory;

})
