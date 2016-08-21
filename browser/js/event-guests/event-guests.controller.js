app.controller("EventGuestsCtrl", function($scope, allEvents, EventGuestFactory){

  $scope.allEvents = allEvents;

  $scope.selectedEvent = null;

  $scope.guests = [];

  $scope.searchParams = {};

  $scope.loadEventGuests = function(eventId){
    $scope.selectedEvent = eventId;
    EventGuestFactory.getAllEventAttendees(eventId)
    .then(function(resultArray){
      /* Reset filter params if they have been set. */
      angular.copy({}, $scope.searchParams);
      angular.copy(resultArray, $scope.guests);
    })
  }

  $scope.filterAttendees = function(){
      $scope.searchParams["registeredAttendee"] = $scope.searchName;
      console.log("SEARCH NAME: ", $scope.searchName);
  }

  $scope.resetSearch = function(event){
    event.preventDefault();
    angular.copy({}, $scope.searchParams);
  }

})
