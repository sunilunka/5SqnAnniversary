app.directive("formattedDate", function(ParsingFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/formatted-date/formatted-date.html",
    scope: {
      rawdate: "="
    },
    link: function(scope, element, attrs){

      scope.displayDate = ParsingFactory.shortFormatDate(scope.rawdate);

      scope.$watch(function(){
        return scope.rawdate;
      }, function(newValue, oldValue){
        scope.displayDate = ParsingFactory.shortFormatDate(scope.rawdate);
      })
    }
  }
})
