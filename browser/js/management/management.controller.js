app.controller('ManagementCtrl', function($scope, EventFactory, GuestOriginFactory, attendees, allEvents, allCategories, allPlatforms, categoryObject, SessionService, ParsingFactory, $timeout){

  $scope.currentUser = SessionService.user;

  $scope.attendees = attendees;

  $scope.allEvents = allEvents;

  $scope.allCategories = allCategories;
  $scope.allPlatforms = allPlatforms;

  $scope.overseasGuests = "00";

  GuestOriginFactory.overseasAttendeesListener(function(guestCount){
    $scope.overseasGuests = ParsingFactory.formatNumberForDisplay(guestCount);
    $timeout(function(){
      $scope.$apply();
    });
  });

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
