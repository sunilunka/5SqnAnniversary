app.service("MessageSessionService", function($firebaseArray, $state, MessagingFactory, NotificationService){
  var self = this;

  this.messageSession = null;

  this.getSession = function(){
    return this.messageSession;
  }

  this.setPeerToPeerSession = function(currentUserId, candidateId){
    /* Check if peer to peer chat already exists, and if so, set the session accordingly. */
    MessagingFactory.checkMessageSessionExists(currentUserId, candidateId, function(snapshot){
      if(snapshot){
        console.log("SERVICE: ", snapshot.val());
        let sessionId = snapshot.val()[candidateId];
        self.messageSession = sessionId;
        $state.go("messaging.session", {sessionId: sessionId})
      } else {
        // MessagingFactory.createNewChat([currentUserId, candidateId])
      }
    })

    this.sendMessage = function(messageObj){
      messageObj.dtg = firebase.database.ServerValue.TIMESTAMP;
      return MessagingFactory.addNewMessage(self.messageSession, messageObj);
    }


    this.leaveSession = function(){
      self.messageSession = null;
      self.messages = null;
    }


  }

})
