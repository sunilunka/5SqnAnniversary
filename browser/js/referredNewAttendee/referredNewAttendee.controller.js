app.controller("referredNewAttendeeCtrl", function($scope, events, categories, platforms, $rootScope){
  /* Controller used if user tries to login, but has no account. */
  $scope.events = events;

  $scope.categories = categories;

  $scope.platforms = platforms;

  // Auth would have been in progress, make sure to remove auth overlay.
  $rootScope.$broadcast("authComplete");

})
