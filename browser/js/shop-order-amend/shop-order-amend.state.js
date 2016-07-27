app.config(function($stateProvider){
  $stateProvider.state("shopOrderAmend", {
    url: "/order/amend",
    templateUrl: "js/shop-order-amend/shop-order-amend.html",
    controller: "ShopOrderAmendCtrl"
  })
})
