app.directive("textFieldCheck", function($rootScope){
  return {
    restrict: "A",
    require: "?ngModel",
    link: function(scope, element, attrs, ngModel){
      if(!ngModel) return;

      var textRegex = /\W|_|\d/g;

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

      console.log("NG_MODEL: ", ngModel);

      // element.on("blur", function(e){
      //   console.log("TEXT VALUE: ", textRegex.test(ngModel.$viewValue), ngModel.$viewValue)
      //   ngModel.$setValidity("invalidText", textRegex.test(ngModel.$viewValue));
      //   console.log("FORM CONTROLLER: ", ngModel);
      // })

    }
  }
})
