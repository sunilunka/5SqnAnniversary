app.config(function($stateProvider){
  $stateProvider.state("eventGuests", {
    url: "/management/events/guests",
    templateUrl: "js/event-guests/event-guests.html",
    controller: "EventGuestsCtrl",
    data: {
      authRequired: true,
      adminRequired: true
    },
    resolve: {
      allEvents: function(EventFactory){
        return EventFactory.getEvents();
      }
    }
  })
})
