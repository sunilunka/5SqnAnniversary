app.controller("AttendeeCtrl", function($scope, AuthService, AttendeeFactory, User, Events, Orders, Announcements, EventFactory, Categories, $state, $rootScope){

  $scope.user = User;

  $scope.events = Events;

  $scope.userCat = Categories[User.association];

  $scope.allAnnouncements = Announcements;

  $scope.orders = Orders;

  $scope.informationDisplay = "announcements";

  $scope.setInformationView = function(value){
      if(value === "announcements"){
        $scope.informationDisplay = "announcements";
      } else if(value === "orders"){
        $scope.informationDisplay = "orders";
      }
  }

  var init = function(){
    if(Orders.length){
      $scope.informationDisplay = "orders";
    } else {
      $scope.informationDisplay = "announcements";
    }
    $rootScope.$broadcast("authComplete");
  }

  init();
})
