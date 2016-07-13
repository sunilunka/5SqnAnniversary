app.factory("ShopifyFactory", function(ShopifyService){


  var ShopifyFactory = {};

  var getVariantOptions = function(product){
    let arrayOfVariants = [];
    product.variants.forEach(function(variant){
      let variantArray = variant.title.split("/").map(function(variantOption){
        return variantOption.trim();
      });
      arrayOfVariants.push(variantArray);
    })
    return arrayOfVariants;
  }


  var buildLookUpTables = function(product){
    var optionLookUpTables = {};
    product.options.forEach(function(option){
      optionLookUpTables[option.name] = {};
      option.values.forEach(function(value){
        optionLookUpTables[option.name][value] = [];
      })
    })
    return optionLookUpTables;
  }

  var populateLookUpTables = function(product, optionLookUpTables){
    let productVars = getVariantOptions(product);

    for(var option in optionLookUpTables){
      let optionType = optionLookUpTables[option];
      for(var optionValue in optionType){
        for(var i = 0; i < productVars.length; i++){
          let variantArr = productVars[i];
          if(variantArr.indexOf(optionValue) > -1){
            for(var j = 0; j < variantArr.length; j++){
              let variantVal = variantArr[j];
              if(variantVal !== optionValue && !optionType.hasOwnProperty(variantVal)){
                if(optionType[optionValue].indexOf(variantVal) === -1){
                  optionType[optionValue].push(variantArr[j]);
                }
              }
            }
          }
        }
      }
    }
    console.log("LOOK UP TABLES: ", optionLookUpTables);
    return optionLookUpTables;
  }

  ShopifyFactory.produceLookUpObject = function(product){
    return populateLookUpTables(product, buildLookUpTables(product));
  }

  ShopifyFactory.getCollectionProducts = (collectionId) => {
    return ShopifyService.shopClient.fetchQueryProducts({collection_id: collectionId })
    .then(function(products){
      return products;
    })
  },

  ShopifyFactory.getProduct = (productId) => {
    return ShopifyService.shopClient.fetchProduct(productId)
    .then(function(product){
      return product;
    })
  }

  return ShopifyFactory;

})
