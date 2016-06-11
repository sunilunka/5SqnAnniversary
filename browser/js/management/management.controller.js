app.controller('ManagementCtrl', function($scope, EventFactory, attendees, allEvents, allCategories, categoryObject, SessionService){

  $scope.currentUser = SessionService.user;

  $scope.attendees = attendees

  $scope.allEvents = allEvents;

  $scope.allCategories = allCategories;

  $scope.catObject = categoryObject;

  console.log("ALL CATEGORIES: ", categoryObject)

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
