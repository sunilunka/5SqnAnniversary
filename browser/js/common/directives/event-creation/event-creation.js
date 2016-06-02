app.directive("eventCreation", function(){
 return {
   restrict: "E",
   templateUrl: "js/common/directives/event-creation/event-creation.html",
   scope: {
     evt: "="
   },
   link: function(scope, element, attrs){

     scope.modifiedEntry = {};

     if(!scope.evt) {
       console.log("NO EVENT, MUST BE A NEW EVENT");
     } else {
       angular.copy(scope.evt, scope.modifiedEntry);
       
       console.log("EVENT FOUND!")
       console.log(scope.modifiedEntry)
     }







   }
 }
})
