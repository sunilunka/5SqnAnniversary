app.directive("formattedText", function(ParsingFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/formatted-text/formatted-text.html",
    scope: {
      rawtext: "="
    },
    link: function(scope, element, attrs){
      scope.displayText = ParsingFactory.parseStringForDisplay(scope.rawtext);

      scope.$watch(function(){
          return scope.rawtext;
        },
        function(newValue, oldValue){
          scope.displayText = ParsingFactory.parseStringForDisplay(scope.rawtext);
      })

    }
  }
})
