app.config(function($stateProvider){
  $stateProvider.state('attendee', {
    url: '/attendee/:id',
    controller: 'AttendeeCtrl',
    templateUrl: 'js/attendee/attendee.html',
    data: {
      authRequired: true
    },
    resolve: {
      User: function(AttendeeFactory){
        return AttendeeFactory.getOne();
      },
      Events: function(EventFactory){
        return EventFactory.getEvents();
      },
      Categories: function(GuestCategoryFactory){
        return GuestCategoryFactory.getGuestCategoriesObject();
      },
      Announcements: function(AnnouncementsFactory){
        return AnnouncementsFactory.getAllAnnouncements();
      },
      Orders: function(OrderFactory, $stateParams){
        return OrderFactory.getAllUserOrders($stateParams.id);
      }
    }
  })
})
