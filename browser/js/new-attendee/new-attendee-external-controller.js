app.controller("NewAttendeeExternalCtrl", function($scope, $stateParams, Events, categories, platforms){

  $scope.events = Events;
  $scope.categories = categories;
  $scope.platforms = platforms;
  $scope.method = $stateParams.provider;

})
