app.controller("ManagementEventsCtrl", function($scope, allEvents, allCategories){

  $scope.cats = allCategories;

  $scope.eventCreationActive = false;


  $scope.toggleEventCreation = () => {
    $scope.eventCreationActive = !$scope.eventCreationActive;
  }

})
