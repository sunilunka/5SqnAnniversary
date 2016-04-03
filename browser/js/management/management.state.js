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
      }
    }
  })
  .state('management.events', {
    url: '/events',
    controller: 'ManagementEventsCtrl',
    templateUrl: 'js/management/management-events.html'
  })
  .state('management.announcements', {
    url: '/announcements',
    controller: 'ManagementAnnouncementsCtrl',
    templateUrl: 'js/management/management-announcements.html'
  })
})
