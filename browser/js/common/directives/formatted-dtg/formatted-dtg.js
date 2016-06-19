app.directive("formattedDtg", function($timeout){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/formatted-dtg/formatted-dtg.html",
    scope: {
      rawdtg: "=",
    },
    link: function(scope, element, attrs){

      let momentDate = moment(scope.rawdtg)

      scope.formattedDtg = momentDate.fromNow();

      setInterval(function(){
        scope.formattedDtg = momentDate.fromNow();
        $timeout(function(){
          scope.$apply()
        }, 1);
      }, 30000)

    }
  }
})
