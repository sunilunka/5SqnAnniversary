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


  productOption.prototype.transformChoicesToArray = function(){
    this.name = this.name.toLowerCase();
    this.choices = this.choices.toUpperCase();
    /* Remove any duplicate entries */
    var toUpdate = _.uniq(this.choices.split(" "));
    this.choices = toUpdate.join(" ");
    angular.copy(toUpdate, this.choicesArray);
    return this;
  }


  ShopManagementFactory.getCurrentUserId = function(){
    var currentUser = AuthService.getCurrentUser();
    return (currentUser.uid || currentUser.id)
  }

  ShopManagementFactory.convertToOptionObj = function(optionObj){
    var newOption  = new productOption(optionObj);
    return newOption.transformChoicesToArray();
  }

  ShopManagementFactory.addNewProduct = function(productData){
    var userId = ShopManagementFactory.getCurrentUserId();
    return $http.post("http://127.0.0.1:3000/api/products/new", {
      user_id: userId,
      product: productData
    })
    .then(function(res){
      console.log("RESPONSE STATUS: ", res.status);
    })
  }

  ShopManagementFactory.modifyExistingProduct = function(productData){
    var userId  = ShopManagementFactory.getCurrentUserId();
    $http.put("http://127.0.0.1:3000/api/products/" + productData._id, {
      user_id: userId,
      product: productData
    })
    .then(function(response){
      console.log("UPDATE RESPONSE: ", response.status);
    })
  }

  ShopManagementFactory.convertForServer = function(newProduct, productOptions, newOrUpdate){
    var optionsToStore = {}
    productOptions.forEach(function(optionObj){
      optionsToStore[optionObj.name] = optionObj.choicesArray;
    })
    newProduct.options = optionsToStore;
    if(newOrUpdate){
      return ShopManagementFactory.addNewProduct(newProduct);
    } else {
      return ShopManagementFactory.modifyExistingProduct(newProduct);
    }
  }

  ShopManagementFactory.convertForModification = function(existingProduct){
    if(existingProduct['options']){
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
    } else {
      return;
    }
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

  ShopManagementFactory.removeProduct = function(id){
    var userId  = ShopManagementFactory.getCurrentUserId();
    var request = {
      method: "DELETE",
      url: "http://127.0.0.1:3000/api/products/" + id,
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        user_id: userId
      }
    }
    return $http(request)
    .then(function(response){
      return response;
    })
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
