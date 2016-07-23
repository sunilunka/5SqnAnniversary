app.factory("ShopFactory", function(DatabaseFactory, ShopManagementFactory){


  var ShopFactory = {};

  ShopFactory.getProduct = function(productId){
    return ShopManagementFactory.getProduct(productId);
  }

  var shoppingCart = function(){
    this.products = [];
    this.lineItemCount = 0;
    this.totalPrice = "0.00"
  }

  shoppingCart.prototype.transformToCartItem = function(product, quantity){
    var cartProduct = {};
    angular.copy(product, cartProduct);
    if(cartProduct.hasOwnProperty("variants")){
      delete cartProduct.variants
    }
    delete cartProduct.stock;
    delete cartProduct.description;
    delete cartProduct.imageName;
    cartProduct["quantity"] = quantity;
    return cartProduct;
  }

  shoppingCart.prototype.getlineItemCount = function(){
    if(!this.products.length) this.lineItemCount = 0;
    if(this.products.length === 1){
      this.lineItemCount =  this.products[0].quantity;
    } else {
      this.lineItemCount = this.products.reduce(function(x,y){
        return x.quantity + y.quantity
      })
    }
  }

  shoppingCart.prototype.addItemToCart = function(productObj, quantity){
    /* First check if product is a variant or not. */
    var cartProduct = this.transformToCartItem(productObj, quantity);

    console.log("PRODUCT OBJ: ", productObj)
    this.products.push(cartProduct);
    console.log("CART: ", this.products);


  }

  ShopFactory.generateCart = function(){
    return new shoppingCart();
  }

  return ShopFactory;

})
