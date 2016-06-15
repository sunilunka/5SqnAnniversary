app.service("MessageSessionService", function($firebaseArray, MessagingFactory){
  var self = this;

  this.messageSession = null;

  this.messages = null;

  this.setPeerToPeerSession = function(currentUserId, candidateId){
    /* Check if peer to peer chat already exists, and if so, set the session accordingly. */
    // MessagingFactory.checkMessageSessionExists( currentUserId, userId, function(){
    //
    //   self.messageSession = sessionId;
    //   self.messages = MessagingFactory.getMessages();
    //
    // })

    MessagingFactory.createNewChat([currentUserId, candidateId])

  }

})
