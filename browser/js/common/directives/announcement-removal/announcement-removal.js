app.directive("announcementRemoval", function(AnnouncementsFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/announcement-removal/announcement-removal.html",
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
