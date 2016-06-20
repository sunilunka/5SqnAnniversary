app.factory("EventFactory", function($firebaseArray, $firebaseObject, DatabaseFactory, SessionService, EventGuestFactory, ParsingFactory, NotificationService){
  var eventsRef = DatabaseFactory.dbConnection("events");
  var eventsArray = $firebaseArray(eventsRef);
  var eventsObj = $firebaseObject(eventsRef);


  return {
    getEvents: () => {
      return eventsArray.$loaded()
      .then(function(eventsArray){
        return eventsArray;
      })
    },

    getEventsObject: () => {
      return eventsObj.$loaded()
      .then(function(data){
        return data;
      })
    },

    returnEventDetails: (evtObjId) => {
      return eventsArray.$loaded()
      .then(function(data){
        return data.$getRecord(evtObjId)
      });
    },

    removeEvent: (evtObjId) => {
      /* This function needs to be built out. Button is disabled at this time. Remember to remove ng-disabled from html template when function is built out. */
      return eventsArray.$remove(evtObjId)
      .then(function(ref){
        NotificationService.notify("success", "Event has been removed.")
        return ref;
      })
    },

    addEvent: (eventData) => {
      return eventsArray.$add(eventData)
      .then(function(ref){
        NotificationService.notify("success", "Event has been added.");
        return ref;
      })
    },

    saveEvent: (eventData) => {
      var eventSerial = eventData.$id;
      delete eventData.$id;
      delete eventData.$priority;
      return DatabaseFactory.dbConnection("events/" + eventSerial)
      .update(eventData)
      .then(function(ref){
        NotificationService.notify("success", eventData.name + " has been updated.")
        return ref;
      })

    },

    /* Guests includes the attendee enrolling, default is 1. Transaction is required to ensure data is written to database in the event multiple writes are being attempted to this guests key */
    addAttendeeToEvent: (eventKey, userData, guests) => {
      /* Cannot use object dot or bracket notation in paths for Firebase db. */
      let userAssociation = userData.association;
      return eventsRef.child(eventKey)
      .child("guests").child(userAssociation).transaction(function(currentVal){
        return currentVal + 1;
      })
      .then(function(transactionObj){
        NotificationService.notify("success", "You have been added to the event.")
        return transactionObj;
      })
      .catch(function(error){
        NotificationService.notify("error", "Sorry and error occured: ", error.message);
      })
    },

    /* Remove user from the Event Guest object*/
    removeAttendeeFromEvent: (eventKey, userData, numGuestsToRemove) => {
      /* Cannot use object dot or bracket notation in paths for Firebase db. */
      let userAssociation = userData.association;
      return eventsRef
      .child(eventKey)
      .child("guests")
      .child(userAssociation)
      .transaction(function(currentVal){
        /* If the number of guests to remove is not specified assume only one guest is being removed. */
        let guestDecrement = numGuestsToRemove ? numGuestsToRemove : 1;
        /* If current value is above 0, then decrement by the number of guests to remove, otherwise, return 0 */
        return (currentVal > 0 ? currentVal -= guestDecrement : 0);
      })
      .then(function(transactionObj){
        console.log("COMMITED: ", transactionObj);
      })
      .catch(function(error){
        console.log("SORRY AN ERROR HAS OCCURED: ", error);
      })
    },

    addLimitsToEvent: (eventId, limitObj) => {
      /* Reference to the event guestLimits key. Will be established if it does not exist. */
      var individualEventRef = DatabaseFactory.dbConnection("events/" + eventId + "/guestLimits")


      /* For a user to remove a limit, they just have to remove all values from the nominated form field. */

      return individualEventRef.update(limitObj)
      .then(function(){
        return limitObj;
      })

    },
    /* Depending on user association, check limits of events if any and mark/label as appropriate if no space. Used in referred and new-attendee states. */
    checkLimits: (evtsArray, associationKey) => {
      let availableEvents = evtsArray.map((evt) => {
        /* Are using same array of objects so need to strip the 'available' property each time to reset. */
        if(evt.hasOwnProperty("available")){
          delete evt["available"];
        }
        if(evt.hasOwnProperty("guestLimits")){
          if(evt.guestLimits.hasOwnProperty(associationKey) && evt.guests.hasOwnProperty(associationKey)) {
            let limit = evt.guestLimits[associationKey];
            if(evt.guests[associationKey] < limit){
              evt["available"] = true;
              return evt;
            } else {
              evt["available"] = false;
              return evt;
            }
          } else {
            return evt;
          }

        } else {
          return evt;
        }
      })
      return availableEvents;
    },

    /* Method to remove the 'available' key from any events, to facilitate UI continuity if login register option is changed.*/
    resetLimitIndicator: (evtArray) => {
      let eventsToReset = evtArray;
      return eventsToReset.map((evt) => {
        if(evt.hasOwnProperty("available")){
          delete evt["available"];
        }
        return evt;
      })
    },

    resolveEventDetails: (eventKeys) => {
      /* Events keys is an array */
      return firebase.Promise.all(
      eventKeys.map(function(evtKey){
        return eventsRef.child(evtKey).once("value");
      }))
    }
  }
})
