app.service("MessageSessionService", function($firebaseArray, $state, MessagingFactory, NotificationService){
  var self = this;

  this.messageSession = null;

  this.getSession = function(){
    return this.messageSession;
  }

  this.setPeerToPeerSession = function(currentUserId, candidateId){
    /* Check if peer to peer chat already exists, and if so, set the session accordingly. */
    MessagingFactory.checkMessageSessionExists(currentUserId, candidateId, function(snapshot){
      let snapVal = snapshot.val();
      if(snapVal){
        let sessionId = snapVal[candidateId];
        self.messageSession = sessionId;
        $state.go("messagingSession", {id: currentUserId, sessionId: sessionId})
      } else {
        MessagingFactory.createNewChat([currentUserId, candidateId])
      }
    })
  }

  this.setGroupSession = function(userId, groupObj, callback){
    MessagingFactory.checkGroupSessionExists(userId, groupObj, function(snapshot){
      let snapVal = snapshot.val();
      console.log("SNAP VAL: ", snapshot.key);
      if(snapVal){
        /* User is part of the group so go to session */
        self.messageSession = snapVal;
        $state.go("messagingSession", {id: userId, sessionId: snapVal})
      } else {
        /* User is not part of the group, check if private and if not add them.*/
        console.log("YOU ARE NOT PART OF THIS GROUP");
      }
    })
  }


  this.sendMessage = function(messageObj){
    messageObj.dtg = firebase.database.ServerValue.TIMESTAMP;
    return MessagingFactory.addNewMessage(self.messageSession, messageObj);
  }


  this.leaveSession = function(){
    self.messageSession = null;
    self.messages = null;
  }


})
