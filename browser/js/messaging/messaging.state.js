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
        return GuestCategoryFactory.getGuestCategoriesObject();
      },

      Platforms: function(PlatformsFactory){
        return PlatformsFactory.getPlatformsObject();
      },
      loggedInUser: function(AttendeeFactory){
        return AttendeeFactory.getOne();
      }
    }
  })
  .state("messaging.contacts", {
    url: "/messaging/:id/contacts",
    controller: "MessagingContactsCtrl",
    templateUrl: "js/messaging/messaging-contacts.html",
  })
  .state("messaging.session", {
    url: "/messaging/:id/session",
    controller: "MessagingSessionCtrl",
    templateUrl: "js/messaging/messaging-session.html"
  })
})
