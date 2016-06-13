app.controller("ManagementAnnouncementsCtrl", function($scope, AnnouncementsFactory, allAnnouncements){
  $scope.announcements = allAnnouncements;
  console.log("STATE ANNOUNCEMENTS: ", allAnnouncements);

  $scope.addNew = () => {
    AnnouncementsFactory.addNewAnnouncement($scope.newAnnouncement)
    .then(function(ref){
      console.log("SAVED!");
    })
  }


})
