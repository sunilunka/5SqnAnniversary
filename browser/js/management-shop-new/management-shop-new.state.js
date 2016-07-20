app.config(function($stateProvider){
  $stateProvider.state("newShopProduct", {
    url: "/management/shop/product/new",
    templateUrl: "js/management-shop-new/management-shop-new.html",
    controller: "ManagementShopNewCtrl",
    data: {
      authRequired: true,
      adminRequired: true
    }
  })
})
