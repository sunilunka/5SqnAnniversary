app.controller("ManagementAnnouncementsCtrl", function($scope, AnnouncementsFactory, allAnnouncements){
  console.log("FORM ITEM: ", $scope.newAnnouncementForm)
  $scope.formIsInvalid;

  $scope.announcements = allAnnouncements;

  $scope.addNew = () => {
    AnnouncementsFactory.addNewAnnouncement($scope.newAnnouncement)
    .then(function(ref){
      console.log("SAVED!");
    })
  }


})
