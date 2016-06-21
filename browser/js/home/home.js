app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: "HomeCtrl",
        resolve: {
          allEvents: function(EventFactory){
            return EventFactory.getEvents();
          }
        }
    });
});
