app.directive("productManagement", function(ShopManagementFactory, FirebaseStorageFactory, $timeout){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/product-management/product-management.html",
    scope: {
      product: "="
    },
    link: function(scope, element, attrs){

      scope.newProduct = {
        variants: []
      };

      scope.newVariant = {
        options: {}
      }

      scope.addVariants = false;
      scope.addProductOptions = false;
      scope.newProductOptions = [];

      if(scope.product){
        /* Configure for directive for updating a product */
        angular.copy(scope.product, scope.newProduct);
        var moddedOpts = ShopManagementFactory.convertForModification(scope.existingProduct);
        angular.copy(moddedOpts, scope.newProductOptions);
        var productImages = ShopManagementFactory.populateImageAssetsFromProduct(scope.product)
        angular.copy(productImages, scope.imageAssets);
      }


      scope.addNewProduct = function(){
        ShopManagementFactory.convertForServer(scope.newProduct, scope.newProductOptions);
      }

      scope.resetOptionForm = function(event){
        if(event) event.preventDefault();
        angular.copy({}, scope.newOption);
      }

      var closeOptionForm = function(){
        scope.optionButtonLabel = "Add Options";
        scope.addProductOptions = false;
        scope.resetOptionForm();
      }

      scope.optionButtonLabel = "Add Option";

      scope.toggleAddOptions = function(event){
        event.preventDefault();
        if(!scope.addProductOptions){
          scope.optionButtonLabel = "Close Input";
          scope.addProductOptions = true;
          scope.addVariants = false;
          closeVariantForm();
        } else {
          closeOptionForm();
        }
      }

      scope.variantButtonLabel = "Add Variant";

      var clearVariantForm = function(){
        var blankVariant = { options: {} };
        angular.copy(blankVariant, scope.newVariant);
        return;
      }

      var closeVariantForm = function(){
        clearVariantForm();
        scope.addVariants = false;
        scope.variantButtonLabel = "Add Variant";
      }

      scope.toggleAddVariants = function(event){
        event.preventDefault();
        if(!scope.addVariants){
          scope.addVariants = true;
          scope.addProductOptions = false;
          scope.variantButtonLabel = "Close Input";
          closeOptionForm();
        } else {
          closeVariantForm();
        }
      }

      scope.clearVariants = function(event){
        event.preventDefault();
        scope.addVariants = false;
        scope.variantButtonLabel = "Add Variants";
        angular.copy([], scope.newProduct.variants);
      }


      scope.resetVariantForm = function(event){
        event.preventDefault();
        clearVariantForm();
      }

      scope.populateVariantArray = function(event){
        event.preventDefault();
        console.log("SCOPE NEW VARIANT: ", scope.newVariant, scope.newProduct);
        var toSave = {}
        angular.copy(scope.newVariant, toSave);
        scope.newProduct.variants.push(toSave);
        clearVariantForm();
      }

      scope.populateOptionArray = function(event){
        event.preventDefault();
        var toPush = ShopManagementFactory.convertToOptionObj(scope.newOption);
        scope.newProductOptions.push(toPush);
        angular.copy({}, scope.newOption);
      }


      scope.noOptions = function(event){
        event.preventDefault();
        scope.noProductOptions = true;
        scope.productOptions = false;
        angular.copy([], scope.newProductOptions)
      }

      var removeAllProductAssetsFromServer = function(assetArray){
        if(!assetArray || !assetArray.length) return;
        var toRemove = assetArray.map(function(asset){
          return FirebaseStorageFactory.removeImage(asset.imageName);
        })
        return FirebaseStorageFactory.removeImagesFromServer(toRemove)
      }

      scope.resetFormAndClose = function(event){
        event.preventDefault();
        angular.copy({ variants: [] }, scope.newProduct);
        angular.copy([], scope.newProductOptions);
        removeAllProductAssetsFromServer(scope.imageAssets)
        .then(function(){
          angular.copy([], scope.imageAssets);
        })
        .catch(function(error){
          console.log("SORRY AN ERROR OCCURED: ", error);
        })
      }

      var handleUploadError = function(output){
        scope.displayOutput = output;
        $timeout(function(){
          scope.displayUploadState = false;
          scope.displayOutput = "Uploading";
          scope.assetToUpload = null;
          scope.$apply();
        }, 2000)
      }

      scope.imageAssets = [];

      scope.assetToUpload;

      scope.uploadProgress = 0;

      scope.displayUploadState = false;
      scope.displayOutput = "Uploading...";

      var finalSnap;

      scope.initiateUpload = function(event){
        event.preventDefault(); FirebaseStorageFactory.uploadImage(scope.assetToUpload)
        .on("state_changed",
          function(snapshot){
            finalSnap = snapshot;
            $timeout(function(){
              scope.displayUploadState = true;
              scope.$apply();
            }, 1);

            switch(snapshot.state){
              case "paused":
                scope.displayOutput = "PAUSED"
                break;
              case "running":
                $timeout(function(){
                  scope.$apply()
                },1);
                break;
            }

          },
          function(error){
            switch(error.code){
              case "storage/unauthorized":
                handleUploadError("Sorry, you are not authorized to upload.")
                break;
              case "storage/canceled":
                handleUploadError("Upload cancelled");
                break;
              case "storage/unknown":
                handleUploadError("Sorry, a server error occured")
                break;
            }
          },
          function(){
            /* Upload complete */
            scope.imageAssets.push({
              imageURL: finalSnap.downloadURL,
              imageName: scope.assetToUpload.name
            })
            handleUploadError("COMPLETE!")
          })
      }


      scope.removeProductImage = function(event){
        event.preventDefault();
        delete scope.newProduct.imageName;
        delete scope.newProduct.imageURL;
      }

      scope.removeImage = function(event, imageName){
        event.preventDefault();
        scope.displayUploadState = true;
        scope.displayOutput = "Removing...";
        FirebaseStorageFactory.removeImage(imageName)
        .then(function(){
          if(scope.newProduct['variants']){
            if(scope.newProduct.variants.length){
              scope.newProduct.variants.forEach(function(variant){
                if(variant["imageName"] === imageName){
                  delete variant.imageName
                  delete variant.imageURL
                }
              })
            }
          }
          if(scope.newProduct["imageName"] === imageName){
            delete scope.newProduct.imageName;
            delete scope.newProduct.imageURL;
          }
          _.remove(scope.imageAssets, function(asset){
            return asset.imageName === imageName;
          });
          /* UI timeout to remove the image as soon as possible */
          $timeout(function(){
            scope.$apply();
          }, 1)
          console.log("IS IT REMOVED: ", scope.imageAssets, scope.newProduct.variants);
          $timeout(function(){
            scope.displayUploadState = false;
            scope.displayOutput = "REMOVED!"
            scope.$apply();
          }, 2000)
        })
        .catch(function(error){
          console.error("SORRY AN ERROR OCCURED: ", error);
          $timeout(function(){
            scope.displayUploadState = false;
            scope.displayOutput = "SORRY, AN ERROR OCCURED...!"
          }, 2000)
        })
      }

      scope.$watch(function(){
        return scope.assetToUpload;
      }, function(oldValue, newValue){
        console.log("SCOPE UPLOAD: ", scope.assetToUpload)
      })
    }
  }
})
