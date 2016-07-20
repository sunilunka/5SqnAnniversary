app.config(function($stateProvider){
  $stateProvider.state('managementShopModify', {
    url: "/management/shop/product/:product_id",
    templateUrl: "js/management-shop-modify/management-shop-modify.html",
    controller: "ManagementShopModifyCtrl",
    data: {
      authRequired: true,
      adminRequired: true
    },
    resolve: {
      Product: function(ShopManagementFactory, $stateParams){
        return ShopManagementFactory.getProduct($stateParams.product_id);
      }
    }
  })
})
