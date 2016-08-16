app.controller("ManagementEmailCtrl", function($scope, attendees, allEvents, $timeout){

  $scope.events = allEvents;

  $scope.attendees = attendees;

  $scope.addresseesAdded = false;

  $scope.email = {};

  $scope.dispatchInProgress = false;

  $scope.dispatchStatus = "Sending email...this took take a little while..."

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

    console.log("NEW EMAIL: ", $scope.email)
  }

  var init = function(){
    var eventOptions = allEvents.map(function(evt){
      console.log("EVT: ", evt);
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
