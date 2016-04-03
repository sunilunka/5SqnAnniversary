app.directive("announcementModification", function(AnnouncementsFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/announcement-modification/announcement-modification.html",
    scope: {
      announcement: "="
    },
    link: function(scope, element, attrs){

      scope.modifiedEntry = {};

      /* Boolean to show or hide edit mode form for specific announcement */
      scope.editMode = false;

      scope.editOption = "Edit";

      
      /* Method to remove announcement from Firebase DB */
      scope.removeAnnouncement = AnnouncementsFactory.removeAnnouncement;



      scope.updateAnnouncement = () => {
        _.merge(scope.announcement, scope.modifiedEntry);
        AnnouncementsFactory.saveAnnouncement(scope.announcement)
        .then(function(ref){
          scope.toggleEditMode();
          return;
        })
      }

      scope.toggleEditMode = () => {
        scope.editMode = !scope.editMode;
        scope.editOption = (scope.editOption === "Edit" ? "Cancel Edit" : "Edit")
        /* scope.editMode will be toggled to false if the use has cancelled the edit. So revert the scope.announcement object to the original version. */
        if(scope.editMode) {
          _.assign(scope.modifiedEntry, scope.announcement);
        }
        return;
      }
    }
  }
})
