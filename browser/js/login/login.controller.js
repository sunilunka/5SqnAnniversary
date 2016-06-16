app.controller('LoginCtrl', function ($scope, $state, AttendeeFactory, SessionService, UserAuthFactory, DatabaseFactory, AuthService, SiteAuthFactory) {

    var processError = function(errorMessage){
      if((/email/).test(errorMessage)){
        return "Might want to run the incorrect email checklist, doesn't look quite right..."
      } else if ((/password/).test(errorMessage)){

        return "Whoops, sorry, looks like the Incorrect Password Caution light has illuminated...better try again."
      } else {
        return errorMessage;
      }
    }

    var executeLogin = (method) => {
      var loginData = {
        password: $scope.login.password,
        email: $scope.login.email
      }

      switch(method){
        case "email":
          return AttendeeFactory.loginAttendee(loginData.email, loginData.password)
        break;
        case "facebook":
          return UserAuthFactory.loginWithExternalProvider(method)
          .then(function(authData){
            /* Nothing will happen, no resolve is returned using OAuthRedirect. A user logging in with an external provider is captured when listening for $onAuth events from the Firebase service */
          })
          .catch(function(error){
            $scope.error = error;
          })
        break;
        case "google":
          return UserAuthFactory.loginWithExternalProvider(method)
          .then(function(authData){

          })
          .catch(function(error){
            $scope.error = error;
          })
        break;
        default:
          return new Error("Sorry, a server error has occured, try again.")
        break;
      }
    }

    $scope.login = {};
    $scope.error = null;
    $scope.loginOpts = [
      { method: "email",
        styleName: "email-btn",
        imgLink: "/images/newAttendee/mail-logo.png",
        imgAlt: "Login with email address"
      },
      { method: "facebook",
        styleName: "facebook-btn",
        imgLink: "/images/newAttendee/fb-logo.png",
        imgAlt: "Login with Facebook"
      },
      { method: "google",
        styleName: "google-btn",
        imgLink: "/images/newAttendee/gg-logo.svg",
        imgAlt: "Login with Google"
    }
    ];

    $scope.loginMethodName = null;

    /* Changes loginMethod value to that selected on clicking a button */

    $scope.setLoginMethod = (method) => {
      $scope.loginMethodName = method;
      /* If using social media account plugin, then execute login immediately. */
      if((method === "facebook") || (method === "google")) return executeLogin(method);
      return; /* If using email, return, as the user has to fill out the required form fields. */
    }

    $scope.cancelEmailLogin = () => {
      $scope.loginForm.$setUntouched()
      $scope.loginForm.$setPristine();
      $scope.login = {};
      $scope.loginMethodName = null;
      $scope.error = null;

    }

    $scope.loginWithEmail = function(){
      return executeLogin("email");
    }

    /* */


});
