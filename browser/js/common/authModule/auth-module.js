/* This module is for handling Firebase based authentication in an Angular application */

;(function(){

  if(!window.angular) throw new Error("Looks like angular isn't available!");
  /* Instantiate a new module for user creation and auth handling */
  var app = angular.module('firebaseAuthHandler', ['firebase']);


  /* Define application constants, those used frequently */
  app.constant('FIRE_PARAMS', {
    'ROOT_URL': 'https://5sqnrnzaf.firebaseio.com'
    // 'ATTENDEE_URL': ROOT_URL + '/attendees'
  })


  /* Factory that returns the most commonly used functions for interacting with the Firebase database. */
  app.factory('DatabaseFactory', function($firebaseAuth, FIRE_PARAMS){
    var fireInstance = new Firebase(FIRE_PARAMS.ROOT_URL);
    return {
      dbConnection: (routing) => {
        if(routing){
          return new Firebase(FIRE_PARAMS.ROOT_URL + '/' + routing)
        } else {
          return fireInstance;
        }
      },

      authConnection: () => {
        return $firebaseAuth(fireInstance);
      }
    }
  })

  /* Factory for all user orientated methods. */
  app.factory('UserAuthFactory', function(DatabaseFactory){
    var authRef = DatabaseFactory.authConnection();
    return {
      /* Connect to firebase instance and create a new user using email and password as authentication basis. */
      createNew: userData => {
        return authRef.$createUser(userData);
      },

      /* Login in the user using password and email auth. */
      loginByEmail: data => {
        return authRef.$authWithPassword(data);
      },

      /* Login with an external Firebase Provider.
        Provider => is a string denoting the OAuth provider. Either Facebook or Google.

       */

      loginWithExternalProvider: provider => {
        return authRef.$authWithOAuthRedirect(provider, function(error, authData){
          console.log("REDIRECTING...")
          if(error) {
            console.warn("Sorry an error occured: ", error);
            return error;
          } else {
            return authData;
          }
        })
      },

      /* Remove a user from firebase user database */
      removeUser: userData => {
        return authRef.$removeUser(userData);
      }
    }
  })

  /* */
  app.service('AuthService', function(DatabaseFactory, SessionService, $rootScope, SiteAuthFactory, AttendeeFactory, RegisterFactory, $state, $firebaseObject){
    var self = this;
    var authRef = DatabaseFactory.authConnection();

    this.getUserAuth = () => {
      return authRef.$getAuth();
    }

    this.getCurrentUser = () => {
      if(SessionService.user) return SessionService.user;
      return null
    }

    /* Setup a listener and report function for auth status. */
    this.reportAuthState = () => {
      authRef.$onAuth(authData => {
        if((!SessionService.user) && authData) {
          /* If authData is returned, but user data is not available from SessionService
          => Check if the user has logged in with an external media service, but has not registered data on the site. Look for key 'registerData'
          */
          if(window.sessionStorage.hasOwnProperty("registerData")){
            /* If the sessionStorage object has key registerData, then we are in the new user registration flow from the registration state. If key has data, then retrieve register form data to continue registration and login */
            var userData = SiteAuthFactory.userRegisterInProgress(authData);
            if(userData){
              return AttendeeFactory.createNewUserFromExternalProvider(authData, userData)
              .then(function(userData){
                return RegisterFactory.addUserToEvents(userData)
                .then(function(savedToEvents){
                  return userData;
                })
              })
              .then(function(userData){
                SiteAuthFactory.setSessionAndReRoute(userData, "attendee", {id: userData.uid });
              })
              .catch(function(error){
                  return error;
              })
            }

          }  else {
            /* Find if user has registered data on the site or not and redirect as appropriate */
            SiteAuthFactory.isRegisteredUser(authData)
            .then(function(data){
              /* Promise resolve if user data is returned from firebase instance. Will have key currentUser */
              if(data.currentUser){
                /* If the returned firebase object has registered user data */
                SiteAuthFactory.userIsRegistered(data.currentUser);
              } else if(data.unregistered){
                /* If user does not have any registered user data */
                SiteAuthFactory.userNotRegistered(data.unregistered);
              }
            })
          }

        } else if (SessionService.user && (!authData)){
          /* If there is session user information, but no AuthData, log the user out. This is because the $onAuth callback is fired at an auth event (login, logout etc ) is detected by the firebase backend. This case covers the $unauth, when the user has initiated logout, and no authdata is returned */
          SessionService.destroySession()
          $rootScope.$broadcast('loggedOut');
          $state.go("home");
          console.warn("Logged out!");
          // console.log("SESSION USER LOGGED OUT: ", SessionService.user);
        } else if (SessionService.user && authData) {
          $rootScope.$broadcast('loggedIn', SessionService.user)
          return /* No need to return anything, user is still signed in */
        }
      })
    }

    this.logout = () => {
      DatabaseFactory.authConnection().$unauth();
    }
  })

  /* Session service, has the 'user' property assigned user information when the user is logged in. Value is null when no user is logged in */

  app.service('SessionService', function(){
    var self = this;

    /* user data is data pulled from firebase, not the actual auth data passed from the server */
    this.createSession = data => {
      self.user = data;
      return;
    },

    this.destroySession = () => {
      self.user = null;
      return;
    }

    this.user = null;
  })

})();
