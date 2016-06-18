app.directive("messageContactOptions", function(MessageSessionService, MessagingFactory, GuestCategoryFactory, AttendeeFactory, $timeout, $stateParams, $rootScope, NotificationService){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/message-contact-options/message-contact-options.html",
    scope: {
      targetuser: "=",
      current: "="
    },
    link: function(scope, element, attrs){

      let currentUserId = scope.current.id || scope.current.$id || scope.current.uid;

      let user = scope.targetuser;

      let userId = user.$id;

      let currentSessionData = MessageSessionService.getCurrentSessionDetails();

      scope.userInSession = false;

      scope.sessionType = $stateParams.sessionType;

      scope.addedToGroup = false;

      scope.addToNewGroup = MessageSessionService.getGroupCreationState();

      if(scope.addToNewGroup){
        if(MessageSessionService.checkInGroup(userId)){
          scope.addedToGroup = true;
        } else {
          scope.addedToGroup = false;
        }
      }

      /* Only toggled when a new group is being created and users can be added. */


      MessagingFactory.listenToUserSessions(userId, $stateParams.sessionId, function(snapshot){
        let snapVal = snapshot.val();
        /* If the returned value is truthy, then the type will be number, otherwise the returned value from .val() will be null. Cannot compare by snapshot.key, as this is retained for reference and comparing the snapshot.key and sessionId will therefore always be true. */
        if(typeof(snapVal) === "number" && $stateParams.sessionId !== "no-session"){
          if($stateParams.sessionType === "private" || $stateParams.sessionType === "peer"){
            scope.userInSession = true;
          }
          $timeout(function(){
            scope.$apply();
          }, 50)
        }
        element.addClass("show-options");
      })


      scope.peerToPeerChat = function(){
        MessageSessionService.setPeerToPeerSession(userId, currentUserId)
      }

      scope.addToGroup = function(){
        if(!scope.addToNewGroup && $stateParams.sessionType === "private"){
          MessagingFactory.addUserToGroup(currentSessionData, [userId])
          .then(function(data){
            NotificationService.notify("success", "User added to private group.")
          })
          .catch(function(error){
            NotificationService.notify("error", "Sorry an error occured and the user was not added, try again.")
          })
        } else {
          MessageSessionService.addNewParticipant(userId, function(){
            scope.addedToGroup = true;
            $timeout(function(){
              scope.$apply();
            },1)
          });
        }
      }

      scope.removeFromGroup = function(){
        MessageSessionService.removeParticipantFromGroup(userId, function(){
          console.log("REMOVED FROM GROUP")
          scope.addedToGroup = false;
          $timeout(function(){
            scope.$apply()
          }, 1);
        });
      }

      $rootScope.$on("groupCreationInProgress", function(event, value){
        scope.addToNewGroup = MessageSessionService.getGroupCreationState();
        scope.addedToGroup = MessageSessionService.checkInGroup(userId);
        $timeout(function(){
          scope.$apply()
        }, 1);
      })
    }
  }

})
