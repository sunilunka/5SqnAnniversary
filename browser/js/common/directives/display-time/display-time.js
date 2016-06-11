app.directive("displayTime", function(ParsingFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/display-time/display-time.html",
    scope: {
      modeltime: "="
    },
    link: function(scope, element, attrs){

      scope.displayTime = ParsingFactory.formatNumberObj(scope.modeltime);

      /* Watch for changes on model data that are propogated from Firebase, in particular the blurb, as this is not "deeply" analysed in the firebase array, as it is a long string. The watch function looks for changes on the blurb field, and triggers the display function so that ng-repeat can be conducted on the new blurb.*/

      scope.$watch(function(){
        return scope.modeltime;
      },
        function(newValue, oldValue){
          if(newValue !== oldValue){
            scope.displayTime = ParsingFactory.formatNumberObj(newValue);
          }
      })
    }
  }
})
