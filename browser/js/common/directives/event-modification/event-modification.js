app.directive("eventModification", function(EventFactory, ParsingFactory, $rootScope){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/event-modification/event-modification.html",
    scope: {
      evt: "=",
      categories: "="
    },

    link: function(scope, element, attrs){

      scope.modifiedEntry = {};
      /* Boolean to show or hide edit mode form for specific announcement */
      scope.editMode = false;

      scope.editOption = "Edit";

      scope.guestLimits = {
        displayMenu: false,
      }

      scope.toggleGuestLimits = () => {
        scope.guestLimits.displayMenu = !scope.guestLimits.displayMenu;
      }


      /* Method to remove event from Firebase DB */
      scope.removeEvent = EventFactory.removeEvent;

      /* Toggles edit mode value, which dictates UI configuration for the event-modification directive. */
      scope.toggleEditMode = () => {
        scope.editMode = !scope.editMode;
        return;
      }

      /* If changes to model data occur, then parse the string for display */
      scope.$watch(function(){
          return scope.evt.blurb
        },

        function(newValue, oldValue){
          if(scope.evt.hasOwnProperty("blurb")){
            scope.displayBlurb = ParsingFactory.parseStringForDisplay(scope.evt.blurb);
          }
      })
    }
  }
})
