app.factory("MessagingFactory", function(DatabaseFactory, $firebaseArray, NotificationService, $firebaseObject){

  var sessionMessageStoreRef = DatabaseFactory.dbConnection("sessionMessageStore");
  var userSessionsRef = DatabaseFactory.dbConnection("userSessions");
  var sessionUsersRef = DatabaseFactory.dbConnection("sessionUsers");
  var userToUserRef = DatabaseFactory.dbConnection("userToUserMessaging")
  var attendeesRef = DatabaseFactory.dbConnection("attendees");
  var messageGroupsRef = DatabaseFactory.dbConnection("messageGroups");
  var userToGroupRef = DatabaseFactory.dbConnection("userToGroupMessaging");

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

  var mapGroupToUsers = function(groupType, participantIds, sessionKey, groupKey){
     return participantIds.map(function(id){
      return userToGroupRef.child(id).child(groupType).update({
        [groupKey]: sessionKey
      })
    })
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
      .then(function(data){
        return {
          /* User id will always be first index */
          id: participantIds[0],
          sessionId: messageSessionRef.key,
          sessionType: "peer"
        }
      })
      .catch(function(error){
        NotificationService.notify("error", "Sorry, we couldn't start the chat due to an error: ", + error.message);
        throw error;
      })

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

  MessagingFactory.getPublicGroups = function(){
    return $firebaseArray(messageGroupsRef.child("public")).$loaded();
  }

  MessagingFactory.getUserGroupSessions = function(userId, callback){
    return userToGroupRef.child(userId).on("value", function(snapshot){
        let userGroups = [];
        snapshot.forEach(function(childSnapshot){
          let groupType = childSnapshot.key;
          childSnapshot.forEach(function(innerSnapshot){
            let groupId = innerSnapshot.key;
            userGroups.push(messageGroupsRef.child(groupType).child(groupId)
            .once("value")
            .then(function(lastSnap){
              let groupData = lastSnap.val();
              groupData.$id = groupId;
              return groupData;
            }))
          })
        })
        return firebase.Promise.all(userGroups)
        .then(function(resultsArray){
          callback(resultsArray);
        })
      })
    }

  MessagingFactory.createNewGroupChat = function(groupObj, participantIds){
    /* Group is treated as a 'user' for session association purposes. */
    let newMessageGroup = messageGroupsRef.push();
    let newMessageSession = sessionMessageStoreRef.push();

    groupObj["sessionId"] = newMessageSession.key;



    let operationsToResolve = [];
    console.log("GROUP OBJ: ", groupObj);
    /* Remove participants key and value from object, as no longer required */
    delete groupObj.participants;

    let groupToSave = {};
    groupToSave[newMessageGroup.key] = groupObj;

    let groupForRedirect = groupObj;
    groupForRedirect.$id = newMessageGroup.key;

    if(groupObj["private"]){
      operationsToResolve.push(messageGroupsRef.child("private").update(groupToSave));

      operationsToResolve.push(mapGroupToUsers("private", participantIds, newMessageSession.key, newMessageGroup.key ));

    } else {
      operationsToResolve.push(messageGroupsRef.child("public").update(groupToSave));

      operationsToResolve.push(mapGroupToUsers("public", participantIds, newMessageSession.key, newMessageGroup.key ))
    }

    operationsToResolve.push(mapUserToSessionAndSessionToUser(newMessageSession.key, participantIds));

    return firebase.Promise.all(operationsToResolve);

  }

  MessagingFactory.checkGroupSessionExists = function(userId, groupObj, callback){
    if(groupObj["private"]){
      userToGroupRef.child(userId).child("private").child(groupObj.$id).on("value", function(snapshot){
        callback(snapshot);
      })
    } else {
      userToGroupRef.child(userId).child("public").child(groupObj.$id).on("value", function(snapshot){
        callback(snapshot);
      })
    }
  }

  MessagingFactory.addUserToGroup = function(groupObj, participantArray){

    let groupType;

    if(groupObj["private"]){
      groupType = "private";
    } else {
      groupType = "public";
    }

    return firebase.Promise.all([
      mapUserToSessionAndSessionToUser(groupObj.sessionId, participantArray),
      mapGroupToUsers(groupType, participantArray, groupObj.sessionId, groupObj.$id)
    ])

  }

  MessagingFactory.listenToUserSessions = function(userId, sessionId, callback){
    return userSessionsRef.child(userId).child(sessionId).on("value", function(snapshot){
      callback(snapshot);
    });
  }

  return MessagingFactory;

})
