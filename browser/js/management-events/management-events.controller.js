app.controller("ManagementEventsCtrl", function($scope, allEvents, allCategories){

  $scope.allEvents = allEvents;

  $scope.cats = allCategories;

  $scope.eventCreationActive = false;


  $scope.toggleEventCreation = () => {
    $scope.eventCreationActive = !$scope.eventCreationActive;
  }

})
