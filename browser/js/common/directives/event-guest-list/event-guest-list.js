app.directive("eventGuestList", function(AttendeeEventFactory, EventFactory, AttendeeFactory, $timeout, EventGuestFactory, EmailService, $state){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/event-guest-list/event-guest-list.html",
    scope: {
      details: "=",
      evt: "="
    },
    link: function(scope, element, attrs){

      scope.processingRemoval = false;

      scope.addedToEmail = false;

      scope.userDetails = null;

      scope.initialized = false;


      scope.addToEmailList = function(){
        EmailService.addUserToList(scope.details);
        scope.addedToEmail = true;
        $state.go("managementEmail");

      }

      scope.removeDuplicateGuest = function(guest){
        scope.processingRemoval = true;
        return AttendeeFactory.getUserAssociation(scope.details.$id)
        .then(function(userAssociation){
          var userData = {
            $id: scope.details.$id,
            association: userAssociation
          }
          return AttendeeEventFactory.modifyEventGuestList(scope.evt.$id, userData).removeGuest(guest.ref)
          .then(function(){
            /* Nothing is returned from a removal */
            return AttendeeEventFactory.removeGuestFromAttendeeEvent(userData, scope.evt.$id, guest.ref)
          })
          .then(function(){
            EventGuestFactory.getSingleGuestListObject(scope.evt.$id, scope.details.$id)
            .then(function(updatedObj){
              var checkDollar = /\$/g;
              scope.details.eventGuestList[scope.evt.$id]
              .forEach(function(guest){
                // Check if guest id is in updated object.
                // If not, remove guestObj from array.
                if(!updatedObj.hasOwnProperty(guest.ref)){
                  _.remove(scope.details.eventGuestList[scope.evt.$id], function(g){
                    return g.ref === guest.ref;
                  })
                }
              })
              scope.processingRemoval = false;
              $timeout(function(){
                scope.$apply();
              },1)
            })
          })
        })
      }
    }
  }
});
