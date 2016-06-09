app.directive("eventCreation", function(EventFactory){
 return {
   restrict: "E",
   templateUrl: "js/common/directives/event-creation/event-creation.html",
   scope: {
     evt: "="
   },
   link: function(scope, element, attrs){

     scope.modifiedEntry = {};
     scope.activeDate;

     scope.validDates = [ "Fri 23 Sep 2016", "Sat 24 Sep 2016", "Sun 25 Sep 2016" ];

     scope.modifyDate = (value) => {
       event.preventDefault();
       scope.modifiedEntry.date = value;
       scope.activeDate = value;
     }

     if(!scope.evt) {
       /* No event to render, so return */
       return;
     } else {
       angular.copy(scope.evt, scope.modifiedEntry);
       scope.activeDate = scope.modifiedEntry.date;

       console.log("EVENT FOUND!")
       console.log(scope.modifiedEntry)
     }


     scope.updateEvent = function(){
      console.log("MODIFIED ENTRY: ", scope.modifiedEntry)
       EventFactory.saveEvent(scope.modifiedEntry)
       .then(function(ref){
         console.log("SAVE COMPLETE: ", scope.$parent);
         angular.copy(scope.evt, scope.modifiedEntry);
         scope.$parent.editMode = false;
         console.log("SCOPE PARENT EDIT MODE: ", scope.$parent)
       })
     }







   }
 }
})
