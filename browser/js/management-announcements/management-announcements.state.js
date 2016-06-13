app.config(function($stateProvider){
  $stateProvider.state("managementAnnouncements", {
    url: "/management/announcements",
    controller: "ManagementAnnouncementsCtrl",
    templateUrl: "js/management-announcements/management-announcements.html",
    data: {
      authRequired: true,
      adminRequired: true
    },
    resolve: {
      allAnnouncements: (AnnouncementsFactory) => {
        return AnnouncementsFactory.getAllAnnouncements();
      }
    }
  })
})
