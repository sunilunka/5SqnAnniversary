app.config(function($stateProvider){
  $stateProvider.state("messaging", {
    url: "/messaging/:id",
    controller: "MessagingCtrl",
    templateUrl: "js/messaging/messaging.html",
    resolve: {
      Users: function(AttendeeFactory){
        return AttendeeFactory.getAll();
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
