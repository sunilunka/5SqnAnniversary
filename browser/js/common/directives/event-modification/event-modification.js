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
        buttonText: "Add"
      }

      scope.toggleGuestLimits = () => {
        scope.guestLimits.displayMenu = !scope.guestLimits.displayMenu;
        if(scope.guestLimits.displayMenu){
          scope.guestLimits.buttonText = "Cancel";
        } else {
          scope.guestLimits.buttonText = "Add";
        }
      }


      /* Method to remove event from Firebase DB */
      scope.removeEvent = EventFactory.removeEvent;

      /* Toggles edit mode value, which dictates UI configuration for the event-modification directive. */
      scope.toggleEditMode = () => {
        scope.editMode = !scope.editMode;
        return;
      }

      /* Watch for changes on model data that are propogated from Firebase, in particular the blurb, as this is not "deeply" analysed in the firebase array, as it is a long string. The watch function looks for changes on the blurb field, and triggers the display function so that ng-repeat can be conducted on the new blurb.*/

      scope.$watch(function(){
          return scope.evt.blurb
        },

        function(newValue, oldValue){
          if(scope.evt.hasOwnProperty("blurb")){
            console.log("PARSED ARRAY: ", ParsingFactory.parseForDisplay(scope.evt.blurb))
            scope.displayBlurb = ParsingFactory.parseForDisplay(scope.evt.blurb);
          }
      })
    }
  }
})
