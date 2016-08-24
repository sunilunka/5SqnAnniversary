app.controller("ManagementEmailCtrl", function($scope, attendees, allEvents, $timeout, EmailFactory, EmailService){

  $scope.events = allEvents;

  $scope.attendees = attendees;

  $scope.addresseesAdded = false;

  $scope.email = {};

  $scope.dispatchInProgress = false;

  $scope.selectedUserMode = false;

  $scope.dispatchStatus = "Sending emails...this could take a little while..."

  var designateAddressees = function(group){
    $scope.email.distributionList = group.value;
    $scope.email.groupIdent = group.ident;
    $scope.addresseesAdded = true;

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
    if($scope.selectedUsers){
      $scope.email.distributionList = $scope.selectedUsers;
    }
    EmailFactory.sendGroupEmail($scope.email)
    .then(function(status){
      $scope.dispatchStatus = "All mail sent!"
      $timeout(function(){
        $scope.dispatchInProgress = false;
      }, 2000)
    })
    .catch(function(err){
      $scope.dispatchStatus = "Sorry an error occured: " + err.message;
      $timeout(function(){
        $scope.dispatchInProgress = false;
      }, 2000)
    })
  }

  var init = function(){
    var selectedUsers = EmailService.getSelectedUsers();
    if(selectedUsers.length){
      $scope.selectedUsers = selectedUsers;
      $scope.selectedUserMode = true;
      $scope.addresseesAdded = true;
    }

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
