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
    console.log("PRODUCT TO SEND: ", newProduct);
    // return ShopManagementFactory.addNewProduct(newProduct);
  }

  ShopManagementFactory.convertForModification = function(existingProduct){
    var opts = existingProduct.options;
    var optsForMod = [];
    for(opt in opts){
      optsForMod.push(new productOption({
        name: opt,
        choicesArray: opts[opt],
        choices: opts[opt].join(" ")
      }))
    }
    return optsForMod;
  }


  ShopManagementFactory.getAllProducts = function(){
    console.log("GETTING ALL PRODUCTS: ")
    return $http.get("http://127.0.0.1:3000/api/products")
    .then(DatabaseFactory.parseHTTPRequest);
  }

  ShopManagementFactory.populateImageAssetsFromProduct = function(product){
    var productAssets = [];
    if(product["imageName"] && product["imageURL"]){
      productAssets.push({
        imageName: product.imageName,
        imageURL: product.imageURL
      })
    }

    if(product.variants.length){
      product.variants.forEach(function(variant){
        if(variant["imageName"] && variant["imageURL"]){
          productAssets.push({
            imageName: variant.imageName,
            imageURL: variant.imageURL
          })
        }
      })
    }

    return productAssets;

  }



  return ShopManagementFactory;

})
