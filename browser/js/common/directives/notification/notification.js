app.directive("notificationPanel", function($rootScope, $timeout){
  return{
    restrict: "E",
    templateUrl: "js/common/directives/notification/notification.html",
    link: function(scope, element, attrs){

      var processNotification = function(noteObj){
        scope.message = "";
        var standardResponse = (noteObj) => {
          scope.message = noteObj.message;
          $timeout(function(){
            element.removeClass("display-notification");
          }, 2500)
        }

        var progressCompleteResponse = (callback, noteObj) => {
          element.removeClass("display-in-progress");
          return processNotification(noteObj)
        }



        switch(noteObj.context){
          case "success":
            element.removeClass("display-error");
            element.addClass("display-success");
            return standardResponse(noteObj);
          break;
          case "error":
            element.removeClass("display-succes");
            element.addClass("display-error");
            return standardResponse(noteObj);
          break;
          case "in-progress":
            element.addClass("display-in-progress")
            scope.message = noteObj.message;
          break;
          case "progress-complete":
            progressCompleteResponse(standardResponse, noteObj);
          break;
        }
      }



      $rootScope.$on("notification", function(event, noteObj){
        if(!element.hasClass("display-notification")){
          element.addClass("display-notification")
        }
        return processNotification(noteObj);

      })
    }
  }
})
