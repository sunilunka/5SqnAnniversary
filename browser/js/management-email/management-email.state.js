app.config(function($stateProvider){
  $stateProvider.state("managementEmail", {
    url: "/management/email",
    templateUrl: "js/management-email/management-email.html",
    controller: "ManagementEmailCtrl",
    data: {
      authRequired: true,
      adminRequired: true
    },
    resolve: {
      attendees: (AttendeeFactory) => {
        return AttendeeFactory.getAll();
      },
      allEvents: (EventFactory) => {
        return EventFactory.getEvents();
      }
    }
  })
})
