app.directive("announcementModification", function(AnnouncementsFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/announcement-modification/announcement-modification.html",
    scope: {
      announcement: "="
    },
    link: function(scope, element, attrs){
      scope.removeAnnouncement = (announcement) => {
        AnnouncementsFactory.removeAnnouncement(announcement);
      }
    }
  }
})
