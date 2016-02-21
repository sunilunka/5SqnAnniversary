app.config(function ($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });

});

app.controller('LoginCtrl', function ($scope, $state, AttendeeFactory, SessionService) {

    var processError = function(errorMessage){
      if((/email/).test(errorMessage)){
        return "Might want to run the incorrect email checklist, doesn't look quite right..."
      } else if ((/password/).test(errorMessage)){

        return "Whoops, sorry, looks like the Incorrect Password Caution light has illuminated...better try again."
      }
    }

    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function(loginData){
      AttendeeFactory.loginAttendee(loginData)
      .then(function(userData){
        console.log("USER DATA: ", userData)
        var userInfo = AttendeeFactory.getOne(userData.uid);
        SessionService.createSession(userInfo);
        $state.go("home");
      })
      .catch(function(error){
          console.log("ERROR: ", error.message);
          $scope.error = processError(error.message);
      })
    }

});
