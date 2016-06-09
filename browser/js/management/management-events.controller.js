app.controller("ManagementEventsCtrl", function($scope, allEvents, allCategories){

  $scope.cats = allCategories;

  $scope.eventCreationActive = false;

  $scope.eventCreationLabel = "Create Event";

  $scope.toggleEventCreation = () => {
    $scope.eventCreationActive = !$scope.eventCreationActive;
    $scope.eventCreationActive ? $scope.eventCreationLabel = "Cancel" : $scope.eventCreationLabel = "Create Event";
  }

})
