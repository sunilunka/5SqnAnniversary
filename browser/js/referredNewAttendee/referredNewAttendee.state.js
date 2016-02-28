app.config(function($stateProvider){
  $stateProvider.state('referredNewAttendee', {
    url: '/attendees/referred-register/:provider',
    controller: 'referredNewAttendeeCtrl',
    templateUrl: 'js/referredNewAttendee/referredNewAttendee.html'
  })
})
