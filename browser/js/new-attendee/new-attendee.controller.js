app.controller('NewAttendeeCtrl', function($scope, $rootScope, AttendeeFactory, attendees, Events, categories, $stateParams, $state, FormValidityFactory, EventFactory){
  /* Events, and categories are promises resolved in the ui-router state. Is an array of all entries.  Allows ng-repeat to be used to present all entries */

  $scope.processingData = false;
  $scope.error = null;
  $scope.registerMethodChosen = null;

  /* When clicked, go to sub state that is specified as the argument.*/
  $scope.registerMethod = (method) => {
    $scope.registerMethodChosen = method;
    if(method){
      $state.go("newAttendee." + method);
    } else {
      $state.go("newAttendee");
    }
    return;
  }

})
