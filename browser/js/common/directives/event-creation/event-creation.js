app.directive("eventCreation", function($rootScope, EventFactory, ParsingFactory){
 return {
   restrict: "E",
   templateUrl: "js/common/directives/event-creation/event-creation.html",
   scope: {
     evt: "="
   },
   link: function(scope, element, attrs){

     var convertNumbersForModification = (numberObject) => {
       for(var num in numberObject){
         numberObject[num] = ParsingFactory.parseNumberForModification(numberObject[num]);
       }
     }

     scope.updateMethods = {
       updateEvent: function(){
         EventFactory.saveEvent(scope.modifiedEntry)
         .then(function(ref){
           angular.copy(scope.evt, scope.modifiedEntry);
           scope.$parent.toggleEditMode();
           $rootScope.$digest();
           return;
         })
       },

       cancelEdit: function() {
         event.preventDefault();
         angular.copy(scope.evt, scope.modifiedEntry);
         scope.activeDate = scope.modifiedEntry.date;
         scope.$parent.toggleEditMode();
       }

     };

     scope.newEventMethods = {
       saveEvent: function(){
         return EventFactory.addEvent(scope.modifiedEntry)
         .then(function(ref){
           scope.modifiedEntry = {};
           scope.activeDate = null;
           scope.$parent.toggleEventCreation();
         })
       },

       cancelEdit: function(){
         event.preventDefault();
         scope.modifiedEntry = {};
         scope.activeDate = null;
         scope.$parent.toggleEventCreation();
       }

     }

     scope.updateLabel;
     scope.updateEvent;
     scope.cancelEdit;
     scope.modifiedEntry = {};
     scope.activeDate;

     scope.validDates = [ "Fri 23 Sep 2016", "Sat 24 Sep 2016", "Sun 25 Sep 2016" ];

     scope.modifyDate = (value) => {
       event.preventDefault();
       scope.modifiedEntry.date = value;
       scope.activeDate = value;
     }

     /* On loading directive, if scope.evt does not exist, then the user must be creating a new event. Load the method objects accordingly */
     if(!scope.evt) {
       /* */
       scope.updateLabel = "Save Event";
       scope.cancelEdit = scope.newEventMethods.cancelEdit;
       scope.updateEvent = scope.newEventMethods.saveEvent;
       return;
     } else {
       scope.updateLabel = "Update Event";
       scope.updateEvent = scope.updateMethods.updateEvent;
       scope.cancelEdit = scope.updateMethods.cancelEdit;
       angular.copy(scope.evt, scope.modifiedEntry);
      //  scope.modifiedEntry.startTime = convertNumbersForModification(scope.modifiedEntry.startTime);
       scope.activeDate = scope.modifiedEntry.date;
     }










   }
 }
})
