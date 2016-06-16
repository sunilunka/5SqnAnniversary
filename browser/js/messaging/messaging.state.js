app.config(function($stateProvider){
  $stateProvider.state("messaging", {
    url: "/messaging/:id",
    controller: "MessagingCtrl",
    templateUrl: "js/messaging/messaging.html",
    resolve: {
      Users: function(AttendeeFactory){
        return AttendeeFactory.getAll();
      },
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
      }
    }
  })
  .state("messaging.contacts", {
    url: "/contacts",
    controller: "MessagingContactsCtrl",
    templateUrl: "js/messaging/messaging-contacts.html",
  })
  .state("messaging.session", {
    url: "/session/:sessionId",
    controller: "MessagingSessionCtrl",
    templateUrl: "js/messaging/messaging-session.html",
    resolve: {
      SessionMessages: function(MessagingFactory, $stateParams){
        return MessagingFactory.getSessionMessages($stateParams.sessionId);
      }
    }
  })
})
