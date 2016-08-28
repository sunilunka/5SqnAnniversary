app.controller("EventGuestsCtrl", function($scope, allEvents, EventGuestFactory, $window){

  $scope.allEvents = allEvents;

  $scope.selectedEvent = {};

  $scope.guests = [];

  $scope.userPaymentDetails = {};

  $scope.searchParams = {};

  $scope.guestListLoadInProgress = false;

  $scope.creatingPrintableList = false;

  $scope.fileDownloadLink = null;

  $scope.fileGenerated = false;

  $scope.printLabel = "Create Printable Guest List";

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

  $scope.downloadEventGuestList = function(){
    $scope.creatingPrintableList = true;
    return EventGuestFactory.getEventGuestList($scope.selectedEvent.$id)
    .then(function(data){
      $scope.fileDownloadLink = data.assetPath;
      $scope.fileGenerated = true;
    })
  }

})
