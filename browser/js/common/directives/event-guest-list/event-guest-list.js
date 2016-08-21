app.directive("eventGuestList", function(AttendeeEventFactory, EventFactory, AttendeeFactory, $timeout, EventGuestFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/event-guest-list/event-guest-list.html",
    scope: {
      guestlist: "=",
      evt: "="
    },
    link: function(scope, element, attrs){
      scope.guest = {};

      scope.processingRemoval = false;

      var init = function(){
        for(var key in scope.guestlist){
          var checkDollar = /\$/g;
          if(key !== "details" && !checkDollar.test(key)){
            if(key === "registeredAttendee"){
              scope.guest["attendeeName"] = scope.guestlist[key]
            } else {
              if(scope.guest["guestNames"]){
                if(scope.guest["guestNames"].indexOf(scope.guestlist[key]) === -1){
                  scope.guest["guestNames"].push({
                    ref: key,
                    name: scope.guestlist[key]
                  });
                }
              } else {
                scope.guest["guestNames"] = [{
                  ref: key,
                  name: scope.guestlist[key]
                }];
              }
            }
          }
        }
      }

      scope.removeDuplicateGuest = function(guest){
        scope.processingRemoval = true;
        return AttendeeFactory.getUserAssociation(scope.guestlist.$id)
        .then(function(userAssociation){
          var userData = {
            $id: scope.guestlist.$id,
            association: userAssociation
          }
          return AttendeeEventFactory.modifyEventGuestList(scope.evt, userData).removeGuest(guest.ref)
          .then(function(){
            /* Nothing is returned from a removal */
            return AttendeeEventFactory.removeGuestFromAttendeeEvent(userData, scope.evt, guest.ref)
          })
          .then(function(){
            EventGuestFactory.getSingleGuestListObject(scope.evt, userData.$id)
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

      init();
    }
  }
})
