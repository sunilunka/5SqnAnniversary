app.controller('NewAttendeeCtrl', function($scope, AttendeeFactory, attendees, Events, categories, $stateParams, $state){
  /* Events, and categories are promises resolved in the ui-router state. Is an array of all entries.  Allows ng-repeat to be used to present all entries */

  $scope.events = Events;
  $scope.categories = categories;
  $scope.processingData = false;
  $scope.error = null;
  $scope.registerMethodChosen = null;
  $scope.newAttendeeData = {};

  $scope.registerMethod = (method) => {
    $scope.registerMethodChosen = method;
    return method;
  }

  $scope.saveAttendee = function(){
    $scope.processingData = true;
    console.log("STATE PARAMS: ", $stateParams)
    return AttendeeFactory.createOneAndLogin($scope.registerMethodChosen, $scope.newAttendeeData)
    .then(function(newUser){
      $scope.processingData = false;
    })
    .catch(function(error){
      $scope.error = error;
    })
  };

  $scope.attendees = attendees;

})
