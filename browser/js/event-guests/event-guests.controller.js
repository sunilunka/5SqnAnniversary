app.controller("EventGuestsCtrl", function($scope, allEvents, EventGuestFactory){

  $scope.allEvents = allEvents;

  $scope.selectedEvent = {};

  $scope.guests = [];

  $scope.loadEventGuests = function(eventId){
    EventGuestFactory.getAllEventAttendees(eventId)
    .then(function(resultArray){
      angular.copy(resultArray, $scope.guests);
    })
  }

})
