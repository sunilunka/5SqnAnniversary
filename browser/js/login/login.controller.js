app.controller('LoginCtrl', function ($scope, $state, AttendeeFactory, SessionService, UserAuthFactory, DatabaseFactory, AuthService) {

    var processError = function(errorMessage){
      if((/email/).test(errorMessage)){
        return "Might want to run the incorrect email checklist, doesn't look quite right..."
      } else if ((/password/).test(errorMessage)){

        return "Whoops, sorry, looks like the Incorrect Password Caution light has illuminated...better try again."
      } else {
        return errorMessage;
      }
    }

    $scope.login = {};
    $scope.error = null;
    $scope.loginOpts = [
      { method: "email" },
      { method: "facebook" },
      { method: "google" }];

    $scope.loginMethodName = null;

    /* Changes loginMethod value to that selected on clicking a button */

    $scope.setLoginMethod = (method) => {
      $scope.loginMethodName = method;
      /* If using social media account plugin, then execute login immediately. */
      if((method === "facebook") || (method === "google")) return $scope.executeLogin(method);
      return; /* If using email, return, as the user has to fill out the required form fields. */
    }

    $scope.executeLogin = (method) => {
      var loginData = {
        password: $scope.login.password,
        email: $scope.login.email
      }

      switch(method){
        case "email":
          return AttendeeFactory.loginAttendee(loginData)
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
        break;
        case "facebook":
          return UserAuthFactory.loginWithExternalProvider(method)
          .then(function(authData){
            /* Function that takes user to the register state if they have not registered yet. */
            // let userData = AttendeeFactory.getOne(authData.uid);
            // if(!userData){
            //   AuthService.logout();
            //   console.log("Logged out!");
            //   $state.go("newAttendee");
            // } else {
            //   SessionService.createSession(userData);
            //   $state.go("home");
            // }
          })
          .catch(function(error){
            $scope.error = error;
          })
        break;
        case "google":
          console.info("Sweet, we better get google login setup!");
        break;
        default:
          return new Error("Sorry, a server error has occured, try again.")
        break;
      }
    }

    /* */


});
