app.service("NotificationService", function($rootScope){

  this.createAndBroadcastMessage = function(context, message){
    $rootScope.$broadcast("notification", {
      context: context,
      message: message
    })
  }



})
