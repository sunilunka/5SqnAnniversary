app.config(function($stateProvider){
  $stateProvider.state('attendee', {
    url: '/attendee/:id',
    controller: 'AttendeeCtrl',
    templateUrl: 'js/attendee/attendee.html',
    resolve: {
      // user: function(AttendeeFactory){
      //   console.log("CURRENT USER:", AttendeeFactory.getOne());
      //   return AttendeeFactory.getOne();
      // },
      // UserDetails: function(AttendeeFactory){
      //   return AttendeeFactory.getOne();
      // }
    }
  })
})
