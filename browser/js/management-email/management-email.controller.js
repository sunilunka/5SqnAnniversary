app.controller("ManagementEmailCtrl", function($scope, attendees, allEvents, $timeout, EmailFactory, EmailService, FirebaseStorageFactory){

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
      if($scope.selectedUsers){
        EmailService.resetEmailDistributionList();
      }
      angular.copy({}, $scope.email);
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

  $scope.removeUserFromList = function(user){
    EmailService.removeUserFromList(user);
  }

  $scope.initiateUpload = function(event){

  }

  var handleUploadError = function(output){
    $scope.displayOutput = output;
    $timeout(function(){
      $scope.displayUploadState = false;
      $scope.displayOutput = "Uploading";
      $scope.assetToUpload = null;
      $scope.$apply();
    }, 2000)
  }


  $scope.assetToUpload;

  $scope.uploadProgress = 0;

  $scope.emailAssets = [];
  $scope.assetToUpload = null;

  $scope.displayUploadState = false;
  $scope.displayOutput = "Uploading...";

  var finalSnap;

  $scope.initiateUpload = function(event){
    event.preventDefault(); FirebaseStorageFactory.uploadEmailAttachment($scope.assetToUpload)
    .on("state_changed",
      function(snapshot){
        finalSnap = snapshot;
        $timeout(function(){
          $scope.displayUploadState = true;
          $scope.$apply();
        }, 1);

        switch(snapshot.state){
          case "paused":
            $scope.displayOutput = "PAUSED"
            break;
          case "running":
            $timeout(function(){
              $scope.$apply()
            },1);
            break;
        }

      },
      function(error){
        switch(error.code){
          case "storage/unauthorized":
            handleUploadError("Sorry, you are not authorized to upload.")
            break;
          case "storage/canceled":
            handleUploadError("Upload cancelled");
            break;
          case "storage/unknown":
            handleUploadError("Sorry, a server error occured")
            break;
        }
      },
      function(){
        /* Upload complete */
        $scope.emailAssets.push({
          downloadURL: finalSnap.downloadURL,
          fileName: $scope.assetToUpload.name
        })
        handleUploadError("COMPLETE!")
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
