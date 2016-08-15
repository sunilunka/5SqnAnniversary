app.controller("ManagementEmailCtrl", function($scope, attendees, allEvents, $timeout){

  $scope.events = allEvents;

  $scope.attendees = attendees;

  $scope.addresseesAdded = false;

  $scope.email = {};

  var designateAddressees = function(value){
    $scope.email.distributionList = value;
    $scope.addresseesAdded = true;
    console.log("DISTRIBUTION LIST: ", value);
  }

  $scope.addresses = [{
    title: "All Registered Users",
    value: "attendees",
    action: designateAddressees
  }];


  $scope.submitNewEmail = function(){
    console.log("NEW EMAIL: ", $scope.email)
  }

  var init = function(){
    var eventOptions = allEvents.map(function(evt){
      console.log("EVT: ", evt);
      return {
        title: evt.name + " Guests",
        value: "events/" + evt.$id,
        action: designateAddressees
      }
    })
    angular.copy($scope.addresses.concat(eventOptions), $scope.addresses);

  }

  init();

})
