app.directive("fullPageNotification", function($rootScope, $timeout){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/full-page-notification/full-page-notification.html",
    scope: {},
    link: function(scope, element, attrs){

      var setDisplay = function(){
        if(element.hasClass("display-hidden")){
          element.removeClass("display-hidden");
        }
        return;
      }

      var removeDisplay = function(){
        if(!element.hasClass("display-hidden")){
          element.addClass("display-hidden");
        }
        return;
      }

      $rootScope.$on("authInProgress", function(event, obj){
        scope.message = obj.message;
        setDisplay();
      })

      $rootScope.$on("authComplete", function(event, obj){
        removeDisplay();
        scope.message = "";
      })

      $rootScope.$on("shopLoading", function(event, obj){
        scope.message = "Loading shop, please wait...";
        setDisplay();
      })

      $rootScope.$on("shopLoadComplete", function(event, obj){
        removeDisplay();
        scope.message = "";
      })
    }
  }
})
