app.service("ShopifyService", function(){
  var self = this;

  var shopClient = ShopifyBuy.buildClient({
    apiKey: "726f744d613f29e5d216c147e3bc6770",
    myShopifyDomain: "5-squadron",
    appId: "6"
  });

  this.shopClient = shopClient;

  this.createCart = function(){
    return self.shopClient.createCart()
    .then(function(newCart){
      self.cart = newCart;
    })
  }

  this.getCart = function(){
    return self.cart;
  }

  this.addToCart = function(productObj){
    console.log("SELF CART: ", self.cart);
    return self.cart.addVariants(productObj)
  }


})
