app.factory("OrderFactory", function(DatabaseFactory, $http, NotificationService, $state, AuthService){

  var OrderFactory = {};

  OrderFactory.submitToServer = function(order){
    return $http.post(DatabaseFactory.generateApiRoute("orders/new"), order)
    .then(function(response){
      if(response.status === 200){
        $state.go("shopOrderAmend")
      } else if(response.status === 201){
        $state.go("shopOrderSuccess", {orderId: response.data._id });
      }
    })
  }

  OrderFactory.getOneOrder = function(id){
    console.log("ID: ", id);
    return $http.get(DatabaseFactory.generateApiRoute("orders/" + id))
    .then(function(response){
        return response.data;
    })
    .catch(function(err){
      NotificationService.notify("error", "Sorry and error occured:\n\n" + err.message)
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

  OrderFactory.getAllOrders = function(){
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



  return OrderFactory;

})
