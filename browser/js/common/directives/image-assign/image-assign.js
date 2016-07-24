app.directive("imageAssign", function($timeout){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/image-assign/image-assign.html",
    scope: {
      image: "=",
      product: "=",
      options: "="
    },
    link: function(scope, element, attrs){
      console.log("OPTIONS: ", scope.options);
      console.log("MY IMAGE: ", scope.image)

      scope.selectedOpts = {};

      scope.toggleSelected = function(event, key, val){
        event.preventDefault();
        if(scope.selectedOpts[key] === val){
          delete scope.selectedOpts[key];
        } else {
          scope.selectedOpts[key] = val;
        }
      }

      scope.addImageToProduct = function(event){
        event.preventDefault();
        scope.product.imageURL = scope.image.imageURL;
        scope.product.imageName = scope.image.imageName;
      }

      var optionsMatch = function(variantOpts, matchObj){
        for(var prop in matchObj){
          if(variantOpts[prop] !== matchObj[prop]){
            return false;
          }
        }
        return true;
      }

      scope.addToVariants = function(event){
        event.preventDefault();
        scope.product.variants.forEach(function(variant){
          console.log("MATCHES: ", variant.options);
          if(optionsMatch(variant.options, scope.selectedOpts)){
            variant.imageURL = scope.image.imageURL;
            variant.imageName = scope.image.imageName;
          }
        })
        console.log("SCOPE PRODUCT VARIANTS: ", scope.product.variants);
        console.log("SCOPE SELECTED OPTS: ", scope.selectedOpts);
      }

      scope.$watch(function(){
        return scope.product;
      }, function(newValue, oldValue){
        $timeout(function(){
          scope.$apply();
        },1)
      })

      scope.$watch(function(){
        return scope.options;
      }, function(newValue, oldValue){
        $timeout(function(){
          scope.$apply();
        })
      })

    }
  }
})