app.controller("ManagementEmailCtrl", function($scope, attendees, allEvents, $timeout, EmailFactory){

  $scope.events = allEvents;

  $scope.attendees = attendees;

  $scope.addresseesAdded = false;

  $scope.email = {};

  $scope.dispatchInProgress = false;

  $scope.dispatchStatus = "Sending emails...this could take a little while...";

  var designateAddressees = function(group){
    $scope.email.distributionList = group.value;
    $scope.email.groupIdent = group.ident;
    $scope.addresseesAdded = true;
    console.log("DISTRIBUTION LIST: ", $scope.email);

  }

  $scope.addresses = [{
    title: "All Registered Users",
    value: "attendees",
    action: designateAddressees,
    ident: "all"
  }
];


  $scope.submitNewEmail = function(){
    $scope.dispatchInProgress = true;
    EmailFactory.sendGroupEmail($scope.email)
    .then(function(status){
      $scope.dispatchStatus = "All mail sent!"
      $timeout(function(){
        $scope.dispatchInProgress = false;
      }, 2000)
    })
    .catch(function(err){
      $scope.dispatchStatus = "Sorry and error occured: " + err.message;
      $timeout(function(){
        $scope.dispatchInProgress = false;
      }, 2000)
    })
  }

  var init = function(){
    var eventOptions = allEvents.map(function(evt){
      return {
        title: evt.name + " Guests",
        value: "eventGuests/" + evt.$id,
        ident: evt.$id,
        action: designateAddressees
      }
    })
    angular.copy($scope.addresses.concat(eventOptions), $scope.addresses);

  }

  init();

})
