app.controller("referredNewAttendeeCtrl", function(AttendeeFactory, SiteAuthFactory, $state, $scope, $stateParams){

  $scope.createNewUserFromReferral = () => {
    return AttendeeFactory.createReferredUser($scope.newAttendeeData)
    .then(function(userData){
      SiteAuthFactory.setSessionAndReRoute(userData, "attendee", { id: userData.uid})
    })
    .catch(function(error){
      return error;
    })
  }

})
