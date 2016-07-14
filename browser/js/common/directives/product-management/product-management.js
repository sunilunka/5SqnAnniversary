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

      scope.existingProduct = {};
      scope.existingProductOptions = [];

      if(scope.product){
        console.log("UPDATING A PRODUCT")
        /* Configure for directive for updating a product */
        angular.copy(scope.product, scope.existingProduct);
        var moddedOpts = ShopManagementFactory.convertForModification(scope.existingProduct);
        angular.copy(moddedOpts, existingProductOptions);
      }

      scope.newVariant = {
        options: {}
      }

      scope.addVariants = false;
      scope.addProductOptions = false;
      scope.newProductOptions = [];

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

      scope.variantButtonLabel = "Add Variant"

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
          scope.variantButtonLabel = "Close Input"
          closeOptionForm();
        } else {
          closeVariantForm();
        }
      }

      scope.clearVariants = function(event){
        event.preventDefault();
        scope.addVariants = false;
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

      scope.resetFormAndClose = function(event){
        event.preventDefault();
        angular.copy({ variants: [] }, scope.newProduct);
      }

      var handleUploadError = function(output){
        scope.displayOutput = output;
        $timeout(function(){
          scope.displayUploadState = false;
          scope.displayOutput = "Uploading";
          scope.uploadProgress = 0;
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

      scope.cancelUpload = function(event){
        event.preventDefault();
        if(uploadTask) uploadTask.cancel();
      }

      scope.initiateUpload = function(event){
        event.preventDefault(); FirebaseStorageFactory.uploadImage(scope.assetToUpload)
        .on("state_changed",
          function(snapshot){
            finalSnap = snapshot;
            $timeout(function(){
              scope.uploadProgess = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("PROGRESS: ", (snapshot.bytesTransferred / snapshot.totalBytes) * 100);
              scope.displayUploadState = true;
              scope.$apply();
            }, 1);

            switch(snapshot.state){
              case "paused":
                // scope.displayUploadState = true;
                scope.displayOutput = "PAUSED"
                break;
              case "running":
                // scope.displayUploadState = true;
                $timeout(function(){
                  console.log("UPDATING...");
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
            console.log("THE FUNCTION IS COMING TO YOU LIVE FROM: ", this);
            scope.imageAssets.push({
              url: finalSnap.downloadURL,
              name: scope.assetToUpload.name
            })
            handleUploadError("COMPLETE!")
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
