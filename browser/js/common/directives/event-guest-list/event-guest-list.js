app.directive("eventGuestList", function(){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/event-guest-list/event-guest-list.html",
    scope: {
      guestlist: "="
    },
    link: function(scope, element, attrs){
      scope.guest = {};

      scope.removeDuplicateGuest = function(guest){};

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
