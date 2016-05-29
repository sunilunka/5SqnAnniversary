app.directive("textFieldCheck", function($rootScope){
  return {
    restrict: "A",
    require: "?ngModel",
    link: function(scope, element, attrs, ngModel){
      if(!ngModel) return;

      /* Do not use global as this causes issues as each ngModel validation fires, causing alternate passing/failing of validation.*/
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
