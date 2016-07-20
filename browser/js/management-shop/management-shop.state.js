app.config(function($stateProvider){
  $stateProvider.state("managementShop", {
    url: "/management/shop",
    templateUrl: "js/management-shop/management-shop.html",
    controller: "ManagementShopCtrl",
    data: {
      authRequired: true,
      adminRequired: true
    },
    resolve: {
      allProducts: function(ShopManagementFactory){
        return ShopManagementFactory.getAllProducts();
      }
    }
  })
})
