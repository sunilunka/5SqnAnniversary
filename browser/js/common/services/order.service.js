app.service("OrderService", function($state){

  var self = this;

  this.order = {};

  var calculateNewSubtotal = function(item){
    return (item.quantity * (parseFloat(item.price))).toFixed(2);
  }

  var calculateNewLineItemTotal = function(order){
    var totalItems = 0;
    var items = order.products;
    for(var i = 0; i < items.length; i++){
      totalItems += items[i].quantity;
    }
    return totalItems;
  }

  var calculateTotalPrice = function(order){
    var totalPrice = 0;
    var items = order.products;
    for(var i = 0; i < items.length; i++){
      totalPrice += parseFloat(items[i].subtotal);
    }
    return totalPrice.toFixed(2);

  }


  var calculateNewTotals = function(item, order){
    if(item){
      item.subtotal = calculateNewSubtotal(item);
    }
    order.lineItemCount = calculateNewLineItemTotal(order);
    order.totalPrice = calculateTotalPrice(order);
    console.log("SELF ORDER: ", self.order);
  }

  this.getOrder = function(){
    return self.order;
  }

  this.initialize = function(orderToAmend){
    angular.copy(orderToAmend, self.order);
    return self.getOrder();
  }

  this.amendOrderItem = function(item, callback){
    item.quantity = item.amendedQuantity;
    calculateNewTotals(item, self.order);
    delete item.amendedQuantity;
    callback(self.order);
  }

  this.removeItem = function(item, callback){
    var idx = _.findIndex(self.order.products, function(p){
      if(p.hasOwnProperty("variant_id") && item.hasOwnProperty("variant_id")){
        return p.variant_id === item.variant_id;
      } else {
        return p.product_id === item.product_id;
      }
    })

    self.order.products.splice(idx, 1);
    calculateNewTotals(null, self.order);
    callback(self.order);
  }

  this.checkAllQuantitiesCleared = function(callback){
    var notCleared = self.order.products.some(function(item){
      return item.hasOwnProperty("amendedQuantity");
    })
    callback(notCleared);
  }

  this.cancelOrder = function(){
    angular.copy({}, self.order);
    if(window.sessionStorage.hasOwnProperty('sqnShopCart')){
      window.sessionStorage.removeItem('sqnShopCart');
    }
    $state.go("shopFront")
  }

})
