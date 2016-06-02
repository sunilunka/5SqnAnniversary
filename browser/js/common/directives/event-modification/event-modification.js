app.directive("eventModification", function(EventFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/event-modification/event-modification.html",
    scope: {
      evt: "=",
      categories: "="
    },

    link: function(scope, element, attrs){
      console.log("EVENT: ", scope.evt);
      console.log("MOMENT NOW: ", new Date(scope.evt.date))
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


      var convertDateForStorage = (dateObj) => {
        return {
          stringDate: dateObj.toString(),
        }
      }

      var convertDateForModification = (objToMod, dateString, timeString) => {
          objToMod.date = new Date(dateString);
      }

      var convertDateForDisplay = (dateString) => {
        let splitTime = dateString.split(" ");
        splitTime = splitTime[0] + " " + splitTime[2] + " " + splitTime[1] + " " + splitTime[3];
        scope.displayDate = splitTime;
        return;
      }

      convertDateForDisplay(scope.evt.date);

      scope.displayDate;

      scope.updateEvent = () => {
        _.assign(scope.evt, scope.modifiedEntry);
        let dtg = convertDateForStorage(scope.modifiedEntry.date);
        scope.evt.date = dtg.stringDate;
        EventFactory.saveEvent(scope.evt)
        .then(function(ref){
          scope.toggleEditMode();
          convertDateForDisplay(scope.evt.date);
          return;
        })
      }

      scope.toggleEditMode = () => {
        scope.editMode = !scope.editMode;
        scope.editOption = (scope.editOption === "Edit" ? "Cancel Edit" : "Edit")
        /* scope.editMode will be toggled to false if the use has cancelled the edit. So revert the scope.announcement object to the original version. */
        if(scope.editMode) {
          convertDateForModification(scope.evt, scope.evt.date);
          _.assign(scope.modifiedEntry, scope.evt);
        }
        return;
      }
    }
  }
})
