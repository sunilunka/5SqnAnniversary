app.service("ShopService", function($rootScope, ShopFactory){

  var self = this;


  this.cart;

  this.lineItemCount = 0;

  this.getItemCount = function(){
    self.cart.forEach(function(item){
      self.lineItemCount += item.quantity;
    })
    return;
  }

  this.stringifyCart = function(){
    if(self.cart){
      return JSON.stringify(self.cart);
    }
  }

  this.parseSessionCart = function(){
    if(window.sessionStorage["sqnShopCart"]){
      return JSON.parse(window.sessionStorage["sqnShopCart"]);
    }
  }

  this.checkForLocalCartOnInit = function(){
    if(window.hasOwnProperty("sessionStorage")){
      if(window.sessionStorage["sqnShopCart"]){
        self.cart = ShopFactory.generateCart();
        angular.copy(self.parseSessionCart(), self.cart);
        return;
      } else {
        self.cart = ShopFactory.generateCart();
        return;
      }
    } else {
      /* If browser does not allow sessionStorage, then just cache on service with no redundancy. */
      self.cart = ShopFactory.generateCart();
      return;
    }
  }

  this.getCart = function(){
    return self.cart;
  }

  this.updateShopCart = function(){
    window.sessionStorage.setItem("sqnShopCart", self.stringifyCart())
    $rootScope.$broadcast("updatedCart", self.cart);
  }

  this.addToCart = function(productObj, quantity
  ){
    console.log("PRODUCT: ", productObj);
    self.cart.addItemToCart(productObj, quantity, function(updatedCart){
      self.updateShopCart();
    });
  }

  this.updateCartItem = function(itemId, newQuantity){
    return self.cart.updateLineItem(itemId, newQuantity, function(updatedCart){
      self.updateShopCart();
      return self.cart;
    })
  }

  this.removeCartItem = function(itemId){
    self.cart.removeLineItemFromCart(itemId, function(updatedCart){
      self.updateShopCart();
    })
  }

})
