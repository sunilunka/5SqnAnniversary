app.config(function($stateProvider){
  $stateProvider.state("managementEvents", {
    url: "/management/events",
    controller: "ManagementEventsCtrl",
    templateUrl: "js/management-events/management-events.html",
    data: {
      authRequired: true,
      adminRequired: true
    },
    resolve: {
      allEvents: (EventFactory) => {
        return EventFactory.getEvents();
      },
      allCategories: (GuestCategoryFactory) => {
        return GuestCategoryFactory.getGuestCategories();
      }
    }

  })
})
