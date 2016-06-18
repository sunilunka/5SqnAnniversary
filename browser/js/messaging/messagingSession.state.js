app.config(function($stateProvider){
  $stateProvider.state("messagingSession", {
    url: "/messaging/:id/session/:sessionId/:sessionType",
    controller: "MessagingSessionCtrl",
    templateUrl: "js/messaging/messaging-session.html",
    resolve: {
      Categories: function(GuestCategoryFactory){
        return GuestCategoryFactory.getGuestCategories();
      },

      Events: function(EventFactory){
        return EventFactory.getEvents();
      },

      Platforms: function(PlatformsFactory){
        return PlatformsFactory.getPlatforms();
      },
      loggedInUser: function(AttendeeFactory){
        return AttendeeFactory.getOne();
      },
      SessionMessages: function(MessagingFactory, $stateParams){
        return MessagingFactory.getSessionMessages($stateParams.sessionId);
      }
    }
  })
})
