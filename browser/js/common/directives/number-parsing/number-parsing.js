app.directive("numberParsing", function(){
  return {
    restrict: "A",
    require: "?ngModel",
    link: function(scope, element, attrs, ngModel){
      /* If ngModel does not exist within scope, return */
      if(!ngModel) return;

      ngModel.$parsers.unshift(function(value){
        value = value.toString()
        console.log("VALUE: ", value);
        return value.length === 1 ? "0" + value : value;
      })

      ngModel.$formatters.unshift(function(value){
        return parseInt(value);
      })
    }
  }
})
