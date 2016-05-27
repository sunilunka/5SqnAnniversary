app.controller("NewAttendeeEmailCtrl", function($scope, AttendeeFactory, Events, categories, FormValidityFactory, EventFactory){
  $scope.events = Events;
  $scope.categories = categories;
  $scope.showEvents = false;
  $scope.eventsError = false;
  $scope.newAttendeeData = {};

  $scope.saveAttendee = function(){
    console.log("FORM DATA: ", $scope.newAttendeeData);
    if(FormValidityFactory.checkEvents($scope.newAttendeeData)){
      $scope.eventsError = false;
    } else {
      $scope.eventsError = true;
    }
  }

})
