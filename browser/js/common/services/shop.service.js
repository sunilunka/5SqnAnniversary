app.service("ShopService", function($rootScope){
  var self = this;

  var getLocalCarts = function(){
    /* Check if localStorage has any carts stored to it. */
    let testExp = new RegExp("carts.shopify-buy.");
    let storageKeys = Object.keys(localStorage);
    let cartKeys = storageKeys.filter(function(keyStr){
      if(testExp.test(keyStr)){
        return keyStr;
      }
    })
    return cartKeys;
  }

  var convertLocalCartToObj = function(cartStr){
    return JSON.parse(cartStr);
  }

  var removeLocalCarts = function(){
    let toRemove = getLocalCarts();
    toRemove.forEach(function(cart){
      localStorage.remove(cart);
    })
  }

  var shopClient = ShopifyBuy.buildClient({
    apiKey: "726f744d613f29e5d216c147e3bc6770",
    myShopifyDomain: "5-squadron",
    appId: "6"
  });

  this.shopClient = shopClient;

  this.cart;

  // this.createCart = function(){
  //   return self.shopClient.createCart()
  //   .then(function(newCart){
  //     self.cart = newCart;
  //     return self.cart;
  //   })
  // }

  this.getCart = function(){
    return self.cart;
  }

  this.addToCart = function(productObj){
    console.log("PRODUCT: ", productObj);
    if(!self.cart){
      return self.shopClient.createCart()
      .then(function(newCart){
        self.cart = angular.copy(newCart, self.cart);
        self.cart.addVariants(productObj)
        $rootScope.$broadcast("updatedCart", self.cart);
        // return self.cart;
      })
    } else {
      self.cart.addVariants(productObj)
      .then(function(cart){
        $rootScope.$broadcast("updatedCart", self.cart)
      })
    }
  }

  this.updateCartItem = function(itemId, newQuantity){
    return self.cart.updateLineItem(itemId, newQuantity)
    .then(function(cart){
      $rootScope.$broadcast("updatedCart", self.cart);
      return self.cart;
    })
  }

  this.removeCartItem = function(itemId){
    self.cart.removeLineItem(itemId)
    .then(function(cart){
      $rootScope.$broadcast("updatedCart", self.cart);
    })
  }

})
