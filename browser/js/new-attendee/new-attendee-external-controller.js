app.controller("NewAttendeeExternalCtrl", function($scope, $stateParams, Events, categories){

  $scope.events = Events;
  $scope.categories = categories;
  $scope.method = $stateParams.provider;

})
