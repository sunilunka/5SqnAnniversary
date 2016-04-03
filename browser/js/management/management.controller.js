app.controller('ManagementCtrl', function($scope, EventFactory, attendees, allEvents){
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
    }
  ]
  $scope.submitNewEvent = () => {
    return EventFactory.addEvent($scope.eventName);
  }
})
