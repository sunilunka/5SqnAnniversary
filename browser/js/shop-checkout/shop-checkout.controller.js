app.controller("ShopCheckoutCtrl", function($scope, ShopService, ShopFactory, OrderFactory, AuthService){



  $scope.order = {};

  $scope.deliverable = false;

  $scope.emailValidated = false;

  $scope.checkUserEmail = function(){
    OrderFactory.checkEmailAgainstAttendees($scope.order.email)
    .then(function(user){
      if(user){
        $scope.order.recipient = user.firstName + " " + user.lastName;
        $scope.order.user_id = user.user_id;
        $scope.emailValidated = true;
      }
    })
  }

  $scope.submitOrder = function(){

    console.log("ORDER TO SUBMIT: ", $scope.order);
    OrderFactory.submitToServer($scope.order);
  }

  var init = function(){
    ShopService.checkForLocalCartOnInit();
    angular.copy(ShopService.getCart(), $scope.order);
    $scope.deliverable = ShopFactory.checkAllDeliverable($scope.order.products);
    var currentUser = AuthService.getCurrentUser();
    if(currentUser){
      console.log("CURRENT USER: ", currentUser);
      $scope.order.user_id = (currentUser.uid || currentUser.id);
      $scope.order.recipient = currentUser.firstName + " " + currentUser.lastName;
      $scope.emailValidated = true;
    }

  }

  init();

})
