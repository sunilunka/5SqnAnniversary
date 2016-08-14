app.controller("ManagementEmailCtrl", function($scope, attendees, allEvents){

  $scope.events = allEvents;

  $scope.attendees = attendees;

  $scope.email = {};

  var designateAddressees = function(value){
    $scope.email.distributionList = value;
    console.log("DISTRIBUTION LIST: ", value);
  }

  $scope.addresses = [{
    title: "All Registered Users",
    value: "attendees",
    action: designateAddressees
  }];


  $scope.submitNewEmail = function(){
    console.log("NEW EMAIL: ")
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
