app.factory("ShopManagementFactory", function(DatabaseFactory, $firebaseArray, $http){

  var shopProductRef = DatabaseFactory.dbConnection("shop/products");

  var ShopManagementFactory = {};

  var productOption = function(optionObj){

    this.name = optionObj.name;
    this.choices = optionObj.choices;
    this.choicesArray = [];

  }

  productOption.prototype.transformChoicesToArray = function(){
    this.name = this.name.toLowerCase();
    this.choices = this.choices.toUpperCase();
    /* Remove any duplicate entries */
    var toUpdate = _.uniq(this.choices.split(" "));
    this.choices = toUpdate.join(" ");
    angular.copy(toUpdate, this.choicesArray);
    return this;
  }


  ShopManagementFactory.convertToOptionObj = function(optionObj){
    var newOption  = new productOption(optionObj);
    return newOption.transformChoicesToArray();
  }

  ShopManagementFactory.addNewProduct = function(productData){
    $http.post("http://127.0.0.1:3000/api/products/new", productData)
    .then(DatabaseFactory.parseHTTPRequest)
  }
  
  ShopManagementFactory.convertForServer = function(newProduct, productOptions){
    var optionsToStore = {}
    productOptions.forEach(function(optionObj){
      optionsToStore[optionObj.name] = optionObj.choicesArray;
    })
    newProduct.options = optionsToStore;
    return ShopManagementFactory.addNewProduct(newProduct);
  }


  ShopManagementFactory.getAllProducts = function(){
    console.log("GETTING ALL PRODUCTS: ")
    return $http.get("http://127.0.0.1:3000/api/products")
    .then(DatabaseFactory.parseHTTPRequest);
  }


  ShopManagementFactory.addOptions = function(){
    // $http.get("http://192.168.1.76:3000/api/products")
    // .then(DatabaseFactory.parseHTTPRequest);
  }



  return ShopManagementFactory;

})
