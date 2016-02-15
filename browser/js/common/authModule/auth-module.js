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
      /* Connect to firebase and create a new user using email and password as authentication basis. */
      createNew: userData => {
        return authRef.$createUser(userData);
      },

      /* Login in the user using password and email auth. */
      loginByEmail: data => {
        return authRef.$authWithPassword(data);
      },

      /* Remove a user from firebase database */
      removeUser: userData => {
        return authRef.$removeUser(userData);
      }
    }
  })

  app.service('AuthService', function($firebaseAuth, DatabaseFactory, SessionService, $rootScope){
    var authRef = DatabaseFactory.authConnection();

    this.getCurrentUser = () => {
      if(SessionService.user) return SessionService.user;
      return false
    }

    this.reportAuthState = () => {
      authRef.$onAuth(authData => {
        if((!SessionService.user) && authData) {
          SessionService.createSession(authData);
          console.log("LOGGED IN USER: ", SessionService.user);
          $rootScope.$broadcast('loggedIn', SessionService.user)
        } else if (SessionService.user) {
          $rootScope.$broadcast('loggedIn', SessionService.user)
          return /* No need to return anything, user is still signed in */
        } else {
          SessionService.destroySession()
          $rootScope.$broadcast('loggedOut');
          console.warn("Logged out!");
          console.log("SESSION USER: ", SessionService.user)
        }
      })
    }

    this.logout = () => {
      DatabaseFactory.authConnection().$unauth();
      SessionService.destroySession();
      return;
    }



  })

  app.service('SessionService', function(){
    var self = this;

    this.createSession = data => {
      this.user = data;
      return;
    },

    this.destroySession = () => {
      this.user = null;
      return;
    }

    this.user = null;



  })


})();
