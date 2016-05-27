app.controller("NewAttendeeFbCtrl", function($scope, $rootScope, AttendeeFactory, Events, categories, $stateParams, FormValidityFactory, EventFactory){

  $scope.events = Events;
  $scope.categories = categories;
  $scope.showEvents = false;


})
