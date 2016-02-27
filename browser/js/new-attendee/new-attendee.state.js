app.config(function($stateProvider){
  $stateProvider.state('newAttendee', {
    url: '/attendees/register/:provider',
    controller: 'NewAttendeeCtrl',
    templateUrl: 'js/new-attendee/new-attendee.html',
    resolve: {
      attendees: function(AttendeeFactory){
        return AttendeeFactory.getAll();
      }
    }
  })
})
