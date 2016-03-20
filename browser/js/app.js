'use strict';
window.app = angular.module('FiveSquadronRNZAFApp', ['ui.router', 'ui.bootstrap', 'ngAnimate', 'ngCookies', 'firebase', 'firebaseAuthHandler']);

app.config(function ($urlRouterProvider, $locationProvider) {
    // This turns off hashbang urls (/#about) and changes it to something normal (/about)
    $locationProvider.html5Mode(true);
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');

});

// This app.run is for controlling access to specific states.
app.run(function ($rootScope, $state, FIRE_PARAMS, AuthService, SessionService) {
  AuthService.reportAuthState();

  var stateRequiresAuth = (state) => {
    return state.data && state.data.authRequired;
  }

  /* When ui-router initiates state change, check if the current user had permissions to access the next state. */
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    /* If there is no current user logged in and if the state requires authentication (which will be false if there is no current user) return user to the login page. */
    if(!(AuthService.getCurrentUser()) && stateRequiresAuth(toState)){
      event.preventDefault();
      $state.go('login')
      return;
    }

  })

});
