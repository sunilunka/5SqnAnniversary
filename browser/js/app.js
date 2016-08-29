'use strict';

window.initializeApp = function(){
  var config = {
    apiKey: "AIzaSyAH5WAOikyWrfcVJgqWR9r_FnUxuvVBQww",
    authDomain: "5sqnrnzaf.firebaseapp.com",
    databaseURL: "https://5sqnrnzaf.firebaseio.com",
    storageBucket: "sqnrnzaf.appspot.com",
  };

  return firebase.initializeApp(config);
}

window.initializeApp();

window.app = angular.module('FiveSquadronRNZAFApp', ['ui.router', 'ui.bootstrap', 'ngAnimate','firebase', 'firebaseAuthHandler']);

app.config(function ($urlRouterProvider, $locationProvider) {
    // This turns off hashbang urls (/#about) and changes it to something normal (/about)
    $locationProvider.html5Mode(true);
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise("/");

});

// This app.run is for controlling access to specific states.
app.run(function ($rootScope, $state, $firebaseObject, AuthService, SessionService, ManagementFactory, MessageSessionService) {


  AuthService.reportAuthState();

  var stateRequiresAuth = (state) => {
    return state.data && state.data.authRequired;
  }

  var stateRequiresAdmin = (state) => {
    return state.data && state.data.authRequired && state.data.adminRequired;
  }

  /* When ui-router initiates state change, check if the current user had permissions to access the next state. */
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    /* If there is no current user logged in and if the state requires authentication (which will be false if there is no current user) return user to the login page. */

    let currentUser = AuthService.getCurrentUser();

    if(!(currentUser) && stateRequiresAuth(toState)){
      event.preventDefault();
      $state.go('login')
      return;
    }
    /* To complete, if the user has the property manager, and the is their user id is also annotated against the 'manager' entry in the Firebase Database (FBDB) then allow access to management state. */

    if(currentUser && stateRequiresAuth(toState) && stateRequiresAdmin(toState)){
      let currentUserIdent = currentUser.$id || currentUser.id || currentUser.uid;
      /* If the user is not tagged as a manager or is not in the permissions list on the server, stop*/
      if(!currentUser.manager || !AuthService.checkUserIsManager(currentUserIdent)){
        event.preventDefault();
        $state.go("attendee", {id: currentUserIdent});
      }
    }

    if(toState.name === "shopFront"){
      $rootScope.$broadcast("shopLoading");
    }

  })

});
