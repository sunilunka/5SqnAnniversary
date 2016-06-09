app.config(function($stateProvider){
  $stateProvider.state('referredNewAttendee', {
    url: '/attendees/referred-register/:provider/:referredUid',
    controller: 'referredNewAttendeeCtrl',
    templateUrl: 'js/referredNewAttendee/referredNewAttendee.html',
    resolve: {
      events: (EventFactory) => {
        return EventFactory.getEvents();
      },

      categories: (GuestCategoryFactory) => {
        return GuestCategoryFactory.getGuestCategories();
      }
    }
  })
})
