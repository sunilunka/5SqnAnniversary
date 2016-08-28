app.controller("PrintGuestListCtrl", function($scope, Guests){
  console.log("GUESTS: ", Guests);

  $scope.guests = Guests;

})
