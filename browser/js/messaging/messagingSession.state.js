app.config(function($stateProvider){
  $stateProvider.state("messagingSession", {
    url: "/messaging/:id/session/:sessionId",
    controller: "MessagingSessionCtrl",
    templateUrl: "js/messaging/messaging-session.html",
    resolve: {
      loggedInUser: function(AttendeeFactory){
        return AttendeeFactory.getOne();
      },
      SessionMessages: function(MessagingFactory, $stateParams){
        return MessagingFactory.getSessionMessages($stateParams.sessionId);
      }
    }
  })
})
