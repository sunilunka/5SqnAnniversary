app.service("NotificationService", function($rootScope){

  this.notify = function(context, message){
    $rootScope.$broadcast("notification", {
      context: context,
      message: message
    })
  }



})
