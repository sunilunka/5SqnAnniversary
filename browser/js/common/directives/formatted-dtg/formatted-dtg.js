app.directive("formattedDtg", function(){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/formatted-dtg/formatted-dtg.html",
    scope: {
      rawdtg: "=",
    },
    link: function(scope, element, attrs){

      let momentDate = moment(scope.rawdtg)

      scope.formattedDtg = momentDate.fromNow();

    }
  }
})
