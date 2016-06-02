app.directive("eventCreation", function(EventFactory){
 return {
   restrict: "E",
   templateUrl: "js/common/directives/event-creation/event-creation.html",
   scope: {
     evt: "="
   },
   link: function(scope, element, attrs){

     scope.modifiedEntry = {};

     if(!scope.evt) {

     } else {
       angular.copy(scope.evt, scope.modifiedEntry);
       scope.modifiedEntry.date = new Date(scope.modifiedEntry.date);

       console.log("EVENT FOUND!")
       console.log(scope.modifiedEntry)
     }


     var convertForStorage = function(eventObj){
       eventObj.date = eventObj.date.toString();
       return eventObj;
     }

     scope.updateEvent = function(){
      convertForStorage(scope.modifiedEntry)
       console.log("MODIFIED ENTRY: ", scope.modifiedEntry)
       EventFactory.saveEvent(scope.modifiedEntry)
       .then(function(ref){
         console.log("SAVE COMPLETE");
       })
     }







   }
 }
})
