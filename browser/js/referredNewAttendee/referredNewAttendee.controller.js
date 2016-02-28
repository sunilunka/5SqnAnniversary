app.controller("referredNewAttendeeCtrl", function(AttendeeFactory, $state, $scope, $stateParams){
  var referrer = $stateParams.provider;

  $scope.createNewReferredUser = () => {
    if(!referrer){
      /* If user has somehow got to this state without going through the login screen, the provider key will be null, so send to newAttendee state to register properly. (This because they would not have logged in with social media yet)*/
      $state.go("newAttendee");
    } else {
      AttendeeFactory.createOneAndLogin(referrer, $scope.newAttendeeData)
      .then(function(userObj){
        console.log("NEW USER OBJ: ", userObj);
        /* Function that takes new user and redirects to their state */
      })

    }
  }

})
