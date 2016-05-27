app.controller("NewAttendeeEmailCtrl", function($scope, AttendeeFactory, Events, categories, FormValidityFactory, EventFactory){
  $scope.events = Events;
  $scope.categories = categories;
  $scope.showEvents = false;
  $scope.newAttendeeData;
})
