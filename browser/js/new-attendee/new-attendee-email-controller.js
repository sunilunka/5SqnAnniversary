app.controller("NewAttendeeEmailCtrl", function($scope, AttendeeFactory, Events, categories, FormValidityFactory, EventFactory){
  $scope.events = Events;
  $scope.categories = categories;
  $scope.showEvents = false;
  $scope.eventsError = false;
  $scope.newAttendeeData = {};

  $scope.saveAttendee = function(){
    if(FormValidityFactory.checkEvents($scope.newAttendeeData)){
      $scope.eventsError = false;
      console.log("FORM DATA: ", $scope.newAttendeeData);
      return AttendeeFactory.createOneAndLogin("email", $scope.newAttendeeData)
      .then(function(authData){
        return authData;
      })
      .catch(function(error){
        $scope.eventsError = true;
        return error;
      })
    } else {
      $scope.eventsError = true;
      /* Will implement registering with email once new SDK becomes available. */
    }
  }

})
