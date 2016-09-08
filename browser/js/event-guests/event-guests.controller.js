app.controller("EventGuestsCtrl", function($scope, allEvents, EventGuestFactory, $window, $timeout){

  $scope.allEvents = allEvents;

  $scope.selectedEvent = {};

  $scope.guests = [];

  $scope.searchParams = {};

  $scope.guestListLoadInProgress = false;

  $scope.creatingPrintableList = false;

  $scope.fileDownloadLink = null;

  $scope.fileGenerated = false;

  $scope.printLabel = "Create Printable Guest List";

  $scope.pages = null;

  var paginateList = function(arr){
    var pages = [];
    var singlePage = [];
    var total = arr.length;
    var entries = 30;
    var totalPages = Math.ceil(arr.length/entries);
    var startIndex = 0;
    for(var i = 1; i <= totalPages; i++){
      var endIndex = entries * i;
      pages.push(arr.slice(startIndex, endIndex));
      startIndex = endIndex;
      console.log("PAGES: ", pages);
    }

    return pages;

  }

  $scope.loadEventGuests = function(evt){
    angular.copy(evt, $scope.selectedEvent);
    $scope.guestListLoadInProgress = true;

    EventGuestFactory.getAllEventAttendees(evt.$id)
    .then(function(resultArray){
      /* Reset filter params if they have been set. */
      // $scope.pages = paginateList(resultArray);
      angular.copy({}, $scope.searchParams);
      angular.copy(resultArray, $scope.guests);
      $scope.guestListLoadInProgress = false;
      $scope.fileGenerated = false;
      $scope.fileDownloadLink = null;
      $scope.creatingPrintableList = false
      $timeout(function(){
        $scope.$apply();
      });
    })
  }

  $scope.filterAttendees = function(){
    $scope.searchParams["firstName"] = $scope.search.firstName;
    $scope.searchParams["lastName"] = $scope.search.lastName;
  }

  $scope.resetSearch = function(event){
    event.preventDefault();
    angular.copy({}, $scope.searchParams);
  }

  $scope.downloadEventGuestList = function(){
    $scope.creatingPrintableList = true;
    $scope.printLabel = "GENERATING GUEST LIST PLEASE WAIT..."
    return EventGuestFactory.getEventGuestList($scope.selectedEvent.$id)
    .then(function(data){
      $scope.fileDownloadLink = data.assetPath;
      $scope.fileGenerated = true;
      $scope.printLabel = "Guest List Generation Complete, please click the link opposite to download."
    })
  }

})
