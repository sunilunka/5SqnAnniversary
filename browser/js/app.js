'use strict';
window.app = angular.module('FiveSquadronRNZAFApp', ['ui.router', 'ui.bootstrap', 'ngAnimate', 'firebase', 'firebaseAuthHandler']);

app.config(function ($urlRouterProvider, $locationProvider) {
    // This turns off hashbang urls (/#about) and changes it to something normal (/about)
    $locationProvider.html5Mode(true);
    // If we go to a URL that ui-router doesn't have registered, go to the "/" url.
    $urlRouterProvider.otherwise('/');

});

// This app.run is for controlling access to specific states.
app.run(function ($rootScope, $state, FIRE_PARAMS) {
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){

    console.log('FIRE PARAMS: ', FIRE_PARAMS);

    console.log({
      EVENT: event,
      TOSTATE: toState,
      TOPARAMS: toParams,
    });
  })

});
