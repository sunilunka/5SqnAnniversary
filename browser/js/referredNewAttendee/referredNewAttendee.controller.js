app.controller("referredNewAttendeeCtrl", function($scope, events, categories, platforms){
  /* Controller used if user tries to login, but has no account. */
  $scope.events = events;

  $scope.categories = categories;

  $scope.platforms = platforms;

})
