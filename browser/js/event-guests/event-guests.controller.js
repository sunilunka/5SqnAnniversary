app.controller("EventGuestsCtrl", function($scope, allEvents, EventGuestFactory){

  $scope.allEvents = allEvents;

  $scope.selectedEvent = null;

  $scope.guests = [];

  $scope.loadEventGuests = function(eventId){
    $scope.selectedEvent = eventId;
    EventGuestFactory.getAllEventAttendees(eventId)
    .then(function(resultArray){
      angular.copy(resultArray, $scope.guests);
    })
  }

})
