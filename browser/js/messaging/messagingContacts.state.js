app.config(function($stateProvider){
  $stateProvider.state("messagingContacts", {
    url: "/messaging/:id/contacts",
    controller: "MessagingContactsCtrl",
    templateUrl: "js/messaging/messaging-contacts.html",
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
      }
    }
  })
})
