app.config(function($stateProvider){
  $stateProvider.state('management', {
    url: '/management',
    controller: 'ManagementCtrl',
    templateUrl: 'js/management/management.html',
    resolve: {
      attendees: (AttendeeFactory) => {
        return AttendeeFactory.getAll();
      }
    }
  })
})
