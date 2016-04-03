app.directive("announcementModification", function(AnnouncementsFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/announcement-modification/announcement-modification.html",
    scope: {
      announcement: "="
    },
    link: function(scope, element, attrs){
      /* Boolean to show or hide edit mode form for specific announcement */
      scope.editMode = false;
      /* Method to remove announcement from Firebase DB */
      scope.removeAnnouncement = (announcement) => {
        AnnouncementsFactory.removeAnnouncement(announcement);
      }

      scope.editAnnouncement = () => {
        scope.editMode = true;
        return;
      }

      scope.updateAnnouncement = () => {
        AnnouncementsFactory.saveAnnouncement(scope.announcement)
        .then(function(ref){
          scope.editMode = false;
          return;
        })
      }
    }
  }
})
