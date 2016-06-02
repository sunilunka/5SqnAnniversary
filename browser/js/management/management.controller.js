app.controller('ManagementCtrl', function($scope, EventFactory, attendees, allEvents, SessionService){

  $scope.currentUser = SessionService.user;

  $scope.attendees = attendees

  $scope.allEvents = allEvents;

  $scope.areasToManage = [
    {
      title: "Manage Events",
      state: "management.events"
    },
    {
      title: "Manage Announcements",
      state: "management.announcements"
    },
    {
      title: "Manage Categories",
      state: "management.guestCategories"
    }
  ]
})
