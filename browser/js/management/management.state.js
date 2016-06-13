app.config(function($stateProvider){
  $stateProvider.state('management', {
    url: '/management',
    controller: 'ManagementCtrl',
    templateUrl: 'js/management/management.html',
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
      },

      allAnnouncements: (AnnouncementsFactory) => {
        return AnnouncementsFactory.getAllAnnouncements();
      },

      allCategories: (GuestCategoryFactory) => {
        return GuestCategoryFactory.getGuestCategories();
      },

      categoryObject: (GuestCategoryFactory) => {
        return GuestCategoryFactory.getGuestCategoriesObject();
      },

      allPlatforms: (PlatformsFactory) => {
        return PlatformsFactory.getPlatforms();
      }
    }
  })
  .state('management.guestCategories', {
    url: '/guestCategories',
    controller: 'GuestCategoryCtrl',
    templateUrl: 'js/management/management-guestCategories.html'
  })
})
