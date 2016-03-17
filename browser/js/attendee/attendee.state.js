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
        console.log("CURRENT USER:", AttendeeFactory.getOne());
        return AttendeeFactory.getOne();
      },
      Events: function(EventFactory){
        console.log("EVENTS: ", EventFactory.getEvents())
        return EventFactory.getEvents();
      }
      // UserDetails: function(AttendeeFactory){
      //   return AttendeeFactory.getOne();
      // }
    }
  })
})
