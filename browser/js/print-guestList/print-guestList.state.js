app.config(function($stateProvider){
  $stateProvider.state("printGuestList", {
    url: "/management/events/guests/print-list/:evtId",
    templateUrl: "js/print-guestList/print-guestList.html",
    controller: "PrintGuestListCtrl",
    data: {
      authRequired: true,
      adminRequired: true
    },
    resolve: {
      Guests: function(EventGuestFactory, $stateParams){
        EventGuestFactory.getAllEventAttendees($stateParams.evtId);
      }
    }
  })
})
