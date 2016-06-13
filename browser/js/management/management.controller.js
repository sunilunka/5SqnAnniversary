app.controller('ManagementCtrl', function($scope, EventFactory, attendees, allEvents, allCategories, categoryObject, SessionService){

  $scope.currentUser = SessionService.user;

  $scope.attendees = attendees

  $scope.allEvents = allEvents;

  $scope.allCategories = allCategories;

  $scope.areasToManage = [
    {
      title: "Manage Events",
      state: "managementEvents"
    },
    {
      title: "Manage Announcements",
      state: "managementAnnouncements"
    },
    {
      title: "Manage Categories and Platforms",
      state: "managementCatsAndPlats"
    },
    {
      title: "Manage users",
      state: "managementUsers"
    }
  ]
})
