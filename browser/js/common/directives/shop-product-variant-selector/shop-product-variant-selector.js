app.directive("shopProductVariantSelector", function(){
  return {
    restrict: "EA",
    template: "<button ng-bind='title' ng-click='updateSelectedVariant()'></button>",
    scope: {},
    link: function(scope, element, attrs){
  
    }
  }
})
