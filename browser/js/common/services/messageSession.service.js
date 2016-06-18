app.service("MessageSessionService", function($firebaseArray, $state, MessagingFactory, NotificationService, $rootScope, AuthService){
  var self = this;

  this.messageSession = null;

  this.newGroupInCreation = false;

  this.newGroupParticipants;

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
        $state.go("messagingSession", {id: currentUserId, sessionId: sessionId, sessionType: "peer"})
      } else {
        MessagingFactory.createNewChat([currentUserId, candidateId])
        .then(function(data){
          $state.go("messagingSession", data);
        })
      }
    })
  }

  this.setGroupSession = function(userId, groupObj, callback){
    MessagingFactory.checkGroupSessionExists(userId, groupObj, function(snapshot){
      let snapVal = snapshot.val();
      let groupType;
      if(groupObj["private"]){
        groupType = "private";
      } else {
        groupType = "public";
      }
      if(snapVal){
        /* User is part of the group so go to session */
        self.messageSession = snapVal;
        $state.go("messagingSession", {id: userId, sessionId: snapVal, sessionType: groupType })
      } else {
        /* User is not part of the group, check if private and if not add them.*/
        if(groupObj["private"]){
          /* User should not get to this as the UI and data structure should prevent this. */
          NotificationService.notify("error", "Sorry, this is a private group. For admittance, please ask a member of the group to add you.")
          return;
        } else {
          /* Messaging Factory mapping functions require userId in array, so userId is placed in array for second argument. */
          MessagingFactory.addUserToGroup(groupObj, [userId])
          .then(function(data){
            $state.go("messagingSession", {id: userId, sessionId: groupObj.sessionId, sessionType: groupType });
          })
        }
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

  this.getGroupCreationState = function(){
    return self.newGroupInCreation;
  }

  this.getNewGroupMembers = function(){
    return self.newGroupParticipants;
  }

  this.checkInGroup = function(userId){
    if(self.newGroupParticipants.indexOf(userId) === -1){
      return false;
    } else {
      return true;
    }
  }

  this.addNewParticipant = function(userId, callback){
    if(self.newGroupParticipants.indexOf(userId) === -1){
      self.newGroupParticipants.push(userId);
      callback()
    }
  }

  this.removeParticipantFromGroup = function(userId, callback){
    var isInArray = self.newGroupParticipants.indexOf(userId);
    if(isInArray !== -1){
      self.newGroupParticipants.splice(isInArray, 1);
      callback();
    }
  }

  this.createNewGroupInProgress = function(inProgress, currentUserId){
    if(inProgress){
      self.newGroupInCreation = true;
      self.newGroupParticipants = [currentUserId];
      $rootScope.$broadcast("groupCreationInProgress", true);
    } else {
      self.newGroupInCreation = false;
      self.newGroupParticipants = [];
      $rootScope.$broadcast("groupCreationInProgress", false);
    }
  }


})
