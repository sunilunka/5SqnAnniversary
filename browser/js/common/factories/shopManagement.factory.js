app.factory("ShopManagementFactory", function(DatabaseFactory, $firebaseArray, $http){

  var shopProductRef = DatabaseFactory.dbConnection("shop/products");

  var ShopManagementFactory = {};

  var productOption = function(optionObj){

    this.name = optionObj.name;
    this.choices = optionObj.choices;
    this.choicesArray = [];

  }

  productOption.prototype.transformForStorage = function(){
    var toStore = {};
    toStore[this.name] = this.choicesArray;
    return toStore;
  }

  productOption.prototype.transformChoicesToArray = function(){
    for(var opt in this){
      if(!Array.isArray(this[opt]) && this.hasOwnProperty(opt)){
        this[opt] = this[opt].toUpperCase();
      }
    }
   angular.copy(this.choicesArray, this.choices.split(" "));
   return this;
  }


  ShopManagementFactory.convertToOptionObj = function(optionObj){
    var newOption  = new productOption(optionObj);
    return newOption.transformChoicesToArray();
  }

  ShopManagementFactory.getAllProducts = function(){
    console.log("GETTING ALL PRODUCTS: ")
    return $http.get("http://127.0.0.1:3000/api/products")
    .then(DatabaseFactory.parseHTTPRequest);
  }

  ShopManagementFactory.addNewProduct = function(productData){
    $http.post("http://127.0.0.1:3000/api/products/new", productData)
    .then(DatabaseFactory.parseHTTPRequest)
  }

  ShopManagementFactory.addOptions = function(){
    // $http.get("http://192.168.1.76:3000/api/products")
    // .then(DatabaseFactory.parseHTTPRequest);
  }



  return ShopManagementFactory;

})
