app.directive("eventGuestList", function(AttendeeEventFactory, EventFactory, AttendeeFactory, $timeout, EventGuestFactory, EmailService, $state){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/event-guest-list/event-guest-list.html",
    scope: {
      guestlist: "=",
      evt: "="
    },
    link: function(scope, element, attrs){
      scope.guest = scope.guestlist;

      scope.processingRemoval = false;

      scope.addedToEmail = false;

      scope.userDetails = null;

      scope.initialized = false;


      scope.addToEmailList = function(){
        EmailService.addUserToList(scope.userDetails);
        scope.addedToEmail = true;
        $state.go("managementEmail");

      }

      var init = function(){

      }

      scope.removeDuplicateGuest = function(guest){
        scope.processingRemoval = true;
        return AttendeeFactory.getUserAssociation(scope.guestlist.$id)
        .then(function(userAssociation){
          var userData = {
            $id: scope.guestlist.$id,
            association: userAssociation
          }
          return AttendeeEventFactory.modifyEventGuestList(scope.evt.$id, userData).removeGuest(guest.ref)
          .then(function(){
            /* Nothing is returned from a removal */
            return AttendeeEventFactory.removeGuestFromAttendeeEvent(userData, scope.evt.$id, guest.ref)
          })
          .then(function(){
            EventGuestFactory.getSingleGuestListObject(scope.evt.$id, userData.$id)
            .then(function(updatedObj){
              var checkDollar = /\$/g;
              for(var key in scope.guestlist){
                if(!checkDollar.test(key) && (key !== "registeredAttendee") && (key !== "details")){
                  if(!updatedObj.hasOwnProperty(key)){
                    _.remove(scope.guest["guestNames"], function(g){
                      return g.ref === key;
                    })
                  }
                }
              }
              scope.processingRemoval = false;
            })
          })
        })
      };

    }
  }
})
