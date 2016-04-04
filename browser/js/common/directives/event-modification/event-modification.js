app.directive("eventModification", function(EventFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/event-modification/event-modification.html",
    scope: {
      evt: "="
    },

    link: function(scope, element, attrs){
      console.log("EVENT: ", scope.evt);
      scope.modifiedEntry = {};

      /* Boolean to show or hide edit mode form for specific announcement */
      scope.editMode = false;

      scope.editOption = "Edit";


      /* Method to remove announcement from Firebase DB */
      scope.removeEvent = EventFactory.removeEvent;

      var convertDateForStorageAndDisplay = (dateObj, timeObj) => {
        console.log("DATE AND TIME OBJECTS: ", dateObj, timeObj)
        dateObj.setHours(timeObj.getHours(), timeObj.getMinutes());
        console.log("MERGED TIME: ", dateObj);
      }

      scope.updateEvent = () => {
        convertDateForStorageAndDisplay(scope.modifiedEntry.date, scope.modifiedEntry.startTime);

        // _.assign(scope.evt, scope.modifiedEntry);
        // console.log(scope.evt);
        // EventFactory.saveEvent(scope.evt)
        // .then(function(ref){
        //   scope.toggleEditMode();
        //   return;
        // })
      }

      scope.toggleEditMode = () => {
        scope.editMode = !scope.editMode;
        scope.editOption = (scope.editOption === "Edit" ? "Cancel Edit" : "Edit")
        /* scope.editMode will be toggled to false if the use has cancelled the edit. So revert the scope.announcement object to the original version. */
        if(scope.editMode) {
          _.assign(scope.modifiedEntry, scope.evt);
        }
        return;
      }
    }
  }
})
