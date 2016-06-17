app.controller("MessagingUserSessionsCtrl", function($scope, PeerSessions, MessagingFactory){

  $scope.peerSessions = PeerSessions;

  console.log("PEER SESSIONS: ", PeerSessions);

})
