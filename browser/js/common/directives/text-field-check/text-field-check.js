app.directive("textFieldCheck", function($rootScope){
  return {
    restrict: "A",
    require: "?ngModel",
    link: function(scope, element, attrs, ngModel){
      if(!ngModel) return;

      var textRegex = /\W|_|\d/;

      ngModel.$parsers.unshift(function(value){
        var fieldIsValid = !textRegex.test(value);
        ngModel.$setValidity("invalidText", fieldIsValid);
        return fieldIsValid ? value : undefined;
      })

      ngModel.$formatters.unshift(function(value){
        var fieldIsValid = !textRegex.test(value);
        ngModel.$setValidity("invalidText", fieldIsValid);
        return value;
      })

    }
  }
})
