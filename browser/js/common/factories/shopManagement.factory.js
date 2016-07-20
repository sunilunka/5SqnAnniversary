app.factory("ShopManagementFactory", function(DatabaseFactory, $firebaseArray, $http, AuthService){

  var ShopManagementFactory = {};

  var convertPriceToString = function(priceNum){
    return (priceNum / 100).toFixed(2);
  }
  var productOption = function(optionObj){

    this.name = optionObj.name;
    this.choices = optionObj.choices;
    this.choicesArray = [];

  }

  var getCurentUserId = function(){
    var currentUser = AuthService.getCurrentUser();
    return (currentUser.uid || currentUser.id)
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
    var userId = getCurentUserId();
    return $http.post("http://127.0.0.1:3000/api/products/new", {
      user_id: userId,
      product: productData
    })
    .then(function(res){
      console.log("RESPONSE STATUS: ", res.status);
    })
  }

  ShopManagementFactory.modifyExistingProduct = function(productData){
    var userId  = getCurrentUserId();
    $http.put("http://127.0.0.1:3000/api/products/" + productData._id, {
      user_id: userId,
      product: productData
    })
  }

  ShopManagementFactory.convertForServer = function(newProduct, productOptions){
    var optionsToStore = {}
    productOptions.forEach(function(optionObj){
      optionsToStore[optionObj.name] = optionObj.choicesArray;
    })
    newProduct.options = optionsToStore;
    return ShopManagementFactory.addNewProduct(newProduct);
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

  ShopManagementFactory.getProduct = function(id){
    return $http.get("http://127.0.0.1:3000/api/products/" + id)
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
