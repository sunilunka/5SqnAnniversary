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
        return authRef.$authWithOAuthPopup(provider, function(error, authData){
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
  app.service('AuthService', function($firebaseAuth, $firebaseObject, DatabaseFactory, SessionService, $rootScope, SiteAuthFactory, $state){
    var self = this;
    var authRef = DatabaseFactory.authConnection();

    var userRegistered = function(data){
      SessionService.createSession(data);
      $rootScope.$broadcast("loggedIn", SessionService.user);
      return;
    }

    var userNotRegistered = function(authData){
      /* If user is trying to login with social media account, but have not registered, send them to newAttendee state */
      if(authData.provider !== "email"){
        $state.go("referredNewAttendee", { provider: authData.provider });
        return;
      }
    }

    this.getCurrentUser = () => {
      if(SessionService.user) return SessionService.user;
      return null
    }

    this.reportAuthState = () => {
      authRef.$onAuth(authData => {

        /* CASE: If authData is returned, but user data is available from SessionService
          => Means that the user has logged in with an external media service, but has not registered data on the site.
         */
        if((!SessionService.user) && authData) {
            console.log("AUTH DATA: ", authData);
            /* Find if user has registered data on the site or not and redirect as appropriate */
            SiteAuthFactory.isRegisteredUser(authData)
            .then(function(data){
              /* If data is drawn from data base */
              if(data.currentUser){
                userRegistered(data.currentUser);
              } else if(data.unregistered){
                userNotRegistered(data.unregistered);
              }
            })

        } else if (SessionService.user && (!authData)){
          /* If there is session user information, but no AuthData, log the user out. This is because the $onAuth callback is fired at an auth event (login, logout etc ) is detected by the firebase backend. This case covers the $unauth, when the user has initiaed logout, and no authdata is returned */
          SessionService.destroySession()
          $rootScope.$broadcast('loggedOut');
          console.warn("Logged out!");
          console.log("SESSION USER: ", SessionService.user);

        } else if (SessionService.user) {
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
