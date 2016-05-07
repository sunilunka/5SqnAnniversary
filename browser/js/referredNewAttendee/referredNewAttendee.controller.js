app.controller("referredNewAttendeeCtrl", function(AttendeeFactory, SiteAuthFactory, AuthService, EventFactory, $rootScope, $scope, events){
  /* Controller used if user tries to login, but has no account. */
  $scope.events = events;

  $scope.newAttendeeData = {};

  $scope.createNewUserFromReferral = () => {
    return AttendeeFactory.createReferredUser($scope.newAttendeeData)
    .then(function(userData){
      SiteAuthFactory.setSessionAndReRoute(userData, "attendee", { id: (userData.uid || userData.id)});
      $rootScope.$broadcast("loggedIn", AuthService.getCurrentUser())
      return;
    })
    .catch(function(error){
      return error;
    })
  }

})
