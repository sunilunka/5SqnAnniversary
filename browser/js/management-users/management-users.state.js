app.config(function($stateProvider){
  $stateProvider.state("managementUsers", {
    url: "/management/users",
    controller: "ManagementUsersCtrl",
    templateUrl: "js/management-users/management-users.html",
    data: {
      authRequired: true,
      adminRequired: true
    },
    resolve: {
      Users: function(AttendeeFactory){
        return AttendeeFactory.getAll();
      },
      Categories: function(GuestCategoryFactory){
        return GuestCategoryFactory.getGuestCategories();
      },
      Events: function(EventFactory){
        return EventFactory.getEvents();
      }
    }

  })
})
