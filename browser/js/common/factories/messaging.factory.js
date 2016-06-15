app.factory("MessagingFactory", function(DatabaseFactory, $firebaseArray){

  var messageStoreRef = DatabaseFactory.dbConnection("messageStore");
  var userSessionsRef = DatabaseFactory.dbConnection("userSessions");
  var sessionUsersRef = DatabaseFactory.dbConnection("sessionUsers");

  var MessagingFactory = {};

  MessagingFactory.createNewChat = function(participantIds){
    var messageSessionRef = messageStoreRef.push()

    console.log("MESSAGE SESSION REF: ", messageSessionRef);
    var mapUsersandSessions = particpantsIds.map(function(id){
      var userSessionObj = {};
      /* User session object holds number of unseen messages for user based on their online status */
      userSessionObj[id] = 0;
      return userSessionsRef.child(id).update(userSessionObj);
    })


  }

  MessagingFactory.getMessages = function(sessionId){
    var messages = $firebaseArray(messageStoreRef.child(sessionId));
    return messages.$loaded()
  }

  return MessagingFactory;

})
