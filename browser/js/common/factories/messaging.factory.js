app.factory("MessagingFactory", function(DatabaseFactory, $firebaseArray, NotificationService, $firebaseObject){

  var sessionMessageStoreRef = DatabaseFactory.dbConnection("sessionMessageStore");
  var userSessionsRef = DatabaseFactory.dbConnection("userSessions");
  var sessionUsersRef = DatabaseFactory.dbConnection("sessionUsers");
  var userToUserRef = DatabaseFactory.dbConnection("userToUserMessaging")
  var attendeesRef = DatabaseFactory.dbConnection("attendees");

  var MessagingFactory = {};

  var mapUserToSessionAndSessionToUser = function(sessionId, participantsArray){

    console.log("MESSAGE SESSION REF: ", sessionId);
    var mapUsersAndSessions = participantsArray.map(function(id){
      var userSessionObj = {};
      /* User session object holds number of unseen messages for user based on their online status */
      userSessionObj[sessionId] = 0;
      return userSessionsRef.child(id).update(userSessionObj);
    })

    var mapSessionAndUsers = participantsArray.map(function(id){
      return sessionUsersRef.child(sessionId).update({
          [id]: true
      })
    })

    return firebase.Promise.all([mapUsersAndSessions, mapSessionAndUsers])
  }

  MessagingFactory.createNewChat = function(participantIds){

    if(!Array.isArray(participantIds)){
      participantIds = [];
      for(var i = 0; i < arguments.length; i++) {
        participantsIds.push(arguments[i]);
      }
    }

    /* Create new session key, with no data. */
    var messageSessionRef = sessionMessageStoreRef.push()

    var sessionUserPromisesToResolve = mapUserToSessionAndSessionToUser(messageSessionRef.key, participantIds);

    // console.log("MESSAGE SESSION REF: ", messageSessionRef.key);
    // var mapUsersAndSessions = participantIds.map(function(id){
    //   var userSessionObj = {};
    //   /* User session object holds number of unseen messages for user based on their online status */
    //   userSessionObj[messageSessionRef.key] = 0;
    //   return userSessionsRef.child(id).update(userSessionObj);
    // })
    //
    // var mapSessionAndUsers = participantIds.map(function(id){
    //   return sessionUsersRef.child(messageSessionRef.key).update({
    //       [id]: true
    //   })
    // })

    var mapUserToUserToSession = participantIds.map(function(id){
      let userMap = {};
      participantIds.forEach(function(peerId){
        if(peerId !== id){
          userMap[peerId] = messageSessionRef.key
        }
      })
      return userToUserRef.update({
        [id]: userMap
      })
    })


    return firebase.Promise.all([
        firebase.Promise.all(mapUserToUserToSession),
        sessionUserPromisesToResolve
      ])

  }

  MessagingFactory.getSessionMessages = function(sessionId){
    var messages = $firebaseArray(sessionMessageStoreRef.child(sessionId).orderByKey().limitToLast(30));
    return messages.$loaded()
    .then(function(data){
      return data;
    })
  }

  MessagingFactory.checkMessageSessionExists = function(currentUserId, candidateId, callback){
    return userToUserRef.child(currentUserId).orderByKey().equalTo(candidateId)
    .on("value", function(snapshot){
      console.log("DATA: ", snapshot.val())
      callback(snapshot);
    })
  },

  MessagingFactory.addNewMessage = function(sessionId, messageObj){
    return sessionMessageStoreRef.child(sessionId)
    .push(messageObj)
  }

  MessagingFactory.getPeerToPeerSessions = function(userId, callback){
    return userToUserRef.child(userId).on("value", function(snapshot){
      let peerToPeerArray = [];
      snapshot.forEach(function(childSnapshot){
        let sessionData = {};
        sessionData.peerId = childSnapshot.key;
        sessionData.$id = childSnapshot.val();
        attendeesRef.child(childSnapshot.key).on("value", function(snapshot){
          let peerData = snapshot.val();
          sessionData.displayName = peerData.firstName + " " + peerData.lastName;
          sessionData.online = peerData.online;
          peerToPeerArray.push(sessionData);
        })
      })
      callback(peerToPeerArray);
    })
  }

  return MessagingFactory;

})
