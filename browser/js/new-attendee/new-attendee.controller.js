app.controller('NewAttendeeCtrl', function($scope, $state){
  /* Events, and categories are promises resolved in the ui-router state. Is an array of all entries.  Allows ng-repeat to be used to present all entries */

  $scope.processingData = false;
  $scope.error = null;
  $scope.registerMethodChosen = null;

  /* When clicked, go to sub state that is specified as the argument.*/
  $scope.registerMethod = (method) => {
    $scope.registerMethodChosen = method;
    if(method){
      switch(method){
        case "email":
          $state.go("newAttendee.email")
        break;
        default: $state.go("newAttendee.externalProvider", {provider: method})
      }
    } else {
      $state.go("newAttendee");
    }
    return;
  }

})
