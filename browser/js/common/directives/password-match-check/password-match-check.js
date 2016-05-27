app.directive("passwordMatchCheck", function(){
  return {
    restrict: "A",
    require: "?ngModel",
    link: function(scope, element, attrs, ngModel){
      /* If directive is not placed on an valid element, ngModel will not exist, so return. */
      if(!ngModel) return;

      ngModel.$parsers.unshift(function(value){
        var pwMatch = (value === scope[attrs["passwordMatchCheck"]]);
        ngModel.$setValidity("passwordsMatch", pwMatch);
        return pwMatch ? value : undefined;
      })

      ngModel.$formatters.unshift(function(value){
        var pwMatch = (value === scope[attrs["passwordMatchCheck"]]);
        ngModel.$setValidity("passwordsMatch", pwMatch);
        return value;
      })

    }
  }
})
