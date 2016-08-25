app.controller("EventGuestsCtrl", function($scope, allEvents, EventGuestFactory){

  $scope.allEvents = allEvents;

  $scope.selectedEvent = {};

  $scope.guests = [];

  $scope.userPaymentDetails = {};

  $scope.searchParams = {};

  $scope.guestListLoadInProgress = false;

  $scope.loadEventGuests = function(evt){
    angular.copy(evt, $scope.selectedEvent);
    $scope.guestListLoadInProgress = true;

    EventGuestFactory.getAllEventAttendees(evt.$id)
    .then(function(resultArray){
      /* Reset filter params if they have been set. */
      angular.copy({}, $scope.searchParams);
      angular.copy(resultArray, $scope.guests);
      $scope.guestListLoadInProgress = false;
    })
  }

  $scope.filterAttendees = function(){
      $scope.searchParams["registeredAttendee"] = $scope.searchName;
  }

  $scope.resetSearch = function(event){
    event.preventDefault();
    angular.copy({}, $scope.searchParams);
  }

})
