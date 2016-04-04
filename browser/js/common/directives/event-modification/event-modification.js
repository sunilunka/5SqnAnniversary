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

      var convertToTimeString = (timeObj) => {

      }

      var convertDateForStorage = (dateObj, timeObj) => {
        return {
          stringDate: dateObj.toString(),
          stringTime: timeObj.toString()
        }
      }

      var convertDateForModification = (objToMod, dateString, timeString) => {
          objToMod.date = new Date(dateString);
          objToMod.startTime = new Date(timeString);
      }

      var convertDateForDisplay = (dateString) => {
        let splitTime = dateString.split(" ");
        splitTime = splitTime[0] + " " + splitTime[2] + " " + splitTime[1] + " " + splitTime[3];
        scope.displayDate = splitTime;
        return;
      }

      var convertTimeForDisplay = (timeString) => {
        scope.displayTime = new Date(timeString).toTimeString();
        return;
      }

      convertDateForDisplay(scope.evt.date);
      convertTimeForDisplay(scope.evt.startTime)

      scope.displayDate;

      scope.displayTime;

      scope.updateEvent = () => {
        _.assign(scope.evt, scope.modifiedEntry);
        let dtg = convertDateForStorage(scope.modifiedEntry.date, scope.modifiedEntry.startTime);
        scope.evt.date = dtg.stringDate;
        scope.evt.startTime = dtg.stringTime;
        EventFactory.saveEvent(scope.evt)
        .then(function(ref){
          scope.toggleEditMode();
          convertDateForDisplay(scope.evt.date);
          convertTimeForDisplay(scope.evt.startTime);
          return;
        })
      }

      scope.toggleEditMode = () => {
        scope.editMode = !scope.editMode;
        scope.editOption = (scope.editOption === "Edit" ? "Cancel Edit" : "Edit")
        /* scope.editMode will be toggled to false if the use has cancelled the edit. So revert the scope.announcement object to the original version. */
        if(scope.editMode) {
          convertDateForModification(scope.evt, scope.evt.date, scope.evt.startTime)
          _.assign(scope.modifiedEntry, scope.evt);
        }
        return;
      }
    }
  }
})
