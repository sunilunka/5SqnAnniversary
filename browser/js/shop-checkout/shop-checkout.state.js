app.config(function($stateProvider){
  $stateProvider.state("shopCheckout", {
    url: "/shop/checkout",
    templateUrl: "js/shop-checkout/shop-checkout.html",
    controller: "ShopCheckoutCtrl"
  })
})
