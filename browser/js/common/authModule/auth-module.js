/* This module is for handling Firebase based authentication in an Angular application */

;(function(){

  if(!window.angular) throw new Error("Looks like angular isn't available!");

  if(!window.firebase) throw new Error("Looks like Firebase isn't available!");
  /* Instantiate a new module for user creation and auth handling */
  var app = angular.module('firebaseAuthHandler', ['firebase']);

  /* Factory for all user orientated methods. */
  app.factory('UserAuthFactory', function(DatabaseFactory, NotificationService){
    var authRef = DatabaseFactory.authConnection();
    return {
      /* Connect to firebase instance and create a new user using email and password as authentication basis. */
      createNew: (email, password) => {
        return authRef.$createUserWithEmailAndPassword(email, password);
      },

      /* Login in the user using password and email auth. */
      loginByEmail: (email, password) => {
        return authRef.$signInWithEmailAndPassword(email, password);
      },

      /* Login with an external Firebase Provider.
        Provider => is a string denoting the OAuth provider. Either Facebook or Google.

       */

      loginWithExternalProvider: provider => {
        return authRef.$signInWithRedirect(provider)
        .then(function(authData){
          return authData;
        })
        .then(function(){
          /* Nothing returned here due to redirect */
        })
        .catch(function(error){
          NotificationService.notify("error", "Sorry, we couldn't log you in at this time.");
        })
      },

      /* Remove a user from firebase user database */
      removeCurrentUser: userData => {
        return authRef.$deleteUser();
      }
    }
  })

  /* */
  app.service('AuthService', function(DatabaseFactory, SessionService, $rootScope, SiteAuthFactory, AttendeeFactory, RegisterFactory, $state, $firebaseObject, NotificationService){

    var permissionsObj;

    var authRef = DatabaseFactory.authConnection();

    var managementRef = DatabaseFactory.dbConnection("managers");


    this.checkUserIsManager = (currentUserIdent) => {
      return managementRef.on("value", function(snapshot){
        let data = snapshot.val();
        if(!permissionsObj){
          permissionsObj = data;
        }

        if(permissionsObj){
          if(permissionsObj[currentUserIdent]){
            return true;
          }
        }
        return false;
      })
    }

    this.getCurrentUser = () => {
      if(SessionService.user) return SessionService.user;
      return null
    }

    /* Setup a listener and report function for auth status. */
    this.reportAuthState = () => {
      authRef.$onAuthStateChanged(function(authData){
        if(authData){
          $rootScope.$broadcast("authInProgress", {
            message: "AUTHENTICATING..."
          })
        }
        if((!SessionService.user) && authData) {
          /* If authData is returned, but user data is not available from SessionService
          => Check if the user has logged in with an external media service, but has not registered data on the site. Look for key 'registerData'
          */
          if(window.sessionStorage.hasOwnProperty("registerData")){
            /* If the sessionStorage object has key registerData, then we are in the new user registration flow from the registration state. If key has data, then retrieve register form data to continue registration and login */

            var userData = SiteAuthFactory.userRegisterInProgress(authData);
            if(userData){
              return AttendeeFactory.createNewUserFromExternalProvider(authData, userData)
              .then(function(dbData){
                /* userData could have uid or $id depending on source.*/
                SiteAuthFactory.setSessionAndReRoute(dbData, "attendee", {id: (dbData.uid || dbData.$id || dbData.id) });
              })
              .catch(function(error){
                  return error;
              })
            }

          }  else {
            /* Find if user has registered data on the site or not and redirect as appropriate */
            SiteAuthFactory.isUserRegistered(authData)
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
          NotificationService.notify("success", "You are now logged out")

        } else if (SessionService.user && authData) {
          $rootScope.$broadcast('loggedIn', SessionService.user)
          return;/* No need to return anything, user is still signed in */
        }
      })
    }

    this.logout = () => {
      /* Have to set the user 'online' state to offline prior to logging off. */
      let userId = SessionService.user.uid || SessionService.user.id || SessionService.user.$id;
      AttendeeFactory.setOffline(userId)
      .then(function(data){
        SiteAuthFactory.switchOffDbListeners(userId);
        DatabaseFactory.authConnection().$signOut();
      });
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
