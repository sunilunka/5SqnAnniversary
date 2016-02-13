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
    var appRef = DatabaseFactory.dbConnection();
    var authRef = DatabaseFactory.authConnection();
    return {

      createNew: userData => {
        return authRef.$createuser(userData);
      },

      loginByEmail: data => {
        return authRef.$authWithPassword(data);
      },

      removeUser: userData => {
        return authRef.$removeUser(userData);
      }
    }
  })

  app.service('AuthService', function($firebaseAuth){
    var appRef = new Firebase(FIRE_PARAMS.ROOT_URL);
    var authRef = $firebaseAuth(appRef);



  })

  app.service('SessionService', function($firebaseAuth, AuthService){

  })

})();
