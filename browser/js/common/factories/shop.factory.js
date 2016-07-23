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

  shoppingCart.prototype.getLineItemCount = function(){
    if(!this.products.length) this.lineItemCount = 0;
    if(this.products.length === 1){
      this.lineItemCount =  this.products[0].quantity;
    } else {
      this.lineItemCount = this.products.reduce(function(x,y){
        return x.quantity + y.quantity
      })
    }
  }

  shoppingCart.prototype.cartItemIndex = function(productId){
    return _.findIndex(this.products, function(product){
      return product._id === productId;
    })
  }

  shoppingCart.prototype.calculateTotal = function(){
    var total = 0.00;
    this.products.forEach(function(product){
      total = (product.quantity * (parseFloat(product.price)))
    })
    return total.toFixed(2);
  }

  shoppingCart.prototype.addItemToCart = function(productObj, quantity){
    var cartProduct = this.transformToCartItem(productObj, quantity);
    /* First check if product is a variant or not. */
    var cartIndex = this.cartItemIndex(cartProduct._id);

    if(cartIndex > -1){
      this.products[cartIndex].quantity += quantity;
    } else {
      this.products.push(cartProduct);
    }

    this.getLineItemCount();
    this.totalPrice = this.calculateTotal();
    console.log("PRODUCT OBJ: ", productObj)
    console.log("CART: ", this);
    

  }

  shoppingCart.prototype.removeItemFromCart = function(productId){

  }

  ShopFactory.generateCart = function(){
    return new shoppingCart();
  }

  return ShopFactory;

})
