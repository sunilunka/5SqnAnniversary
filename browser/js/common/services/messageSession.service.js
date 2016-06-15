app.service("MessageSessionService", function($firebaseArray){
  var self = this;

  this.messageSession = null;

  this.messages = null;

  this.setLiveSession = function(sessionId){
    self.messageSession = sessionId;
    self.messages = MessagingFactory.getMessages();
  }

})
