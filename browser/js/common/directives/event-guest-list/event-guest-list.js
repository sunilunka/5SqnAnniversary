app.directive("eventGuestList", function(AttendeeEventFactory, EventFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/event-guest-list/event-guest-list.html",
    scope: {
      guestlist: "=",
      evt: "="
    },
    link: function(scope, element, attrs){
      scope.guest = {};

      scope.removeDuplicateGuest = function(guest){
        console.log("SCOPE EVENT: ", scope.evt)
        console.log("GUEST: ", guest);
        console.log("SCOPE GUEST LIST: ", scope.guestlist);
        return AttendeeEventFactory.modifyEventGuestList(scope.evt, scope.guestlist).removeGuest(guest.ref)
        .then(function(){
          /* Nothing is returned from a removal */
          return AttendeeEventFactory.removeGuestFromAttendeeEvent(scope.guestlist.$id, scope.evt, guest.ref)
        })
      };

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

      init();
    }
  }
})
