app.controller("ManagementAnnouncementsCtrl", function($scope, AnnouncementsFactory, allAnnouncements){

  $scope.announcements = allAnnouncements;

  $scope.addNew = () => {
    AnnouncementsFactory.addNewAnnouncement($scope.newAnnouncement)
    .then(function(ref){
      console.log("SAVED!");
    })
  }


})
