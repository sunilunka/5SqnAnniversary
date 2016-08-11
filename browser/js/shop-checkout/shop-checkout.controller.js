app.controller("ShopCheckoutCtrl", function($scope, ShopService, ShopFactory, OrderFactory, AuthService){

  $scope.order = {};

  $scope.deliverable = false;

  $scope.emailValidated = false;

  $scope.memberValid = false;

  $scope.processing = false;

  $scope.emailProcessing = false;

  $scope.setShippingPrice = function(value){
    $scope.order.deliveryMethod = value;
    if(value === "Post/Courier"){
      $scope.order.shippingPrice = "10.00";
      $scope.order.totalPrice = (parseFloat($scope.order.totalPrice) + 10).toFixed(2);
    } else if ($scope.order.shippingPrice && $scope.order.deliveryMethod){
      delete $scope.order.shippingPrice;
      $scope.order.totalPrice = (parseFloat($scope.order.totalPrice) - 10).toFixed(2);
    }
  }

  $scope.checkUserEmail = function(){
    $scope.emailProcessing = true;
    OrderFactory.checkEmailAgainstAttendees($scope.order.email)
    .then(function(user){
      if(user){
        $scope.order.recipient = user.firstName + " " + user.lastName;
        $scope.order.user_id = user.user_id;
        $scope.emailValidated = true;
        $scope.memberValid = true;
        $scope.emailProcessing = false;
      } else {
        $scope.emailValidated = true;
        $scope.memberValid = false;
        $scope.emailProcessing = false;
      }
    })
  }

  $scope.submitOrder = function(){
    $scope.processing = true;
    OrderFactory.submitToServer($scope.order);
  }

  var init = function(){
    ShopService.checkForLocalCartOnInit();
    angular.copy(ShopService.getCart(), $scope.order);
    $scope.deliverable = ShopFactory.checkAllDeliverable($scope.order.products);
    $scope.processing = false;
    var currentUser = AuthService.getCurrentUser();
    if(currentUser){
      $scope.order.user_id = (currentUser.uid || currentUser.id);
      $scope.order.recipient = currentUser.firstName + " " + currentUser.lastName;
      $scope.order.email = currentUser.email;
      $scope.emailValidated = true;
      $scope.memberValid = true;
    }

  }

  init();

})
