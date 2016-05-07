app.factory('EventFactory', function($firebaseArray, $firebaseObject, DatabaseFactory, $q, SessionService, EventGuestFactory){
  var eventsRef = DatabaseFactory.dbConnection('events');
  var eventsArray = $firebaseArray(eventsRef);
  var eventsObj = $firebaseObject(eventsRef);

  return {
    getEvents: () => {
      return eventsArray.$loaded()
      .then(function(eventsArray){
        return eventsArray;
      })
    },

    returnEventDetails: (evtObjId) => {
      return eventsArray.$loaded()
      .then(function(data){
        return data.$getRecord(evtObjId)
      });
    },

    removeEvent: (evtObjId) => {
      return eventsArray.$remove(evtObjId)
      .then(function(ref){
        console.log("EVENT REMOVED: ", ref);
        return ref;
      })
    },

    addEvent: (eventData) => {
      return eventsArray.$add(eventData)
      .then(function(ref){
        console.log("EVENT ADDED: ", ref)
        return ref;
      })
    },

    saveEvent: (eventData) => {
      return eventsArray.$save(eventData)
      .then(function(ref){
        console.log("UPDATE SAVED: ", ref);
        return ref;
      })

    },

    /* Guests includes the attendee enrolling, default is 1. Transaction is required to ensure data is written to database in the event multiple writes are being attempted to this guests key */
    addAttendeeToEvent: (eventKey, userData, guests) => {
      /* Cannot use object dot or bracket notation in paths for Firebase db. */
      let userAssociation = userData.association;
      return eventsRef.child(eventKey)
      .child("guests").child(userAssociation).transaction(function(currentVal){
        return currentVal += 1;
      })
      .then(function(transactionObj){
        console.log("VALUE RETURNED IN PROMISE: ", transactionObj);
        return transactionObj;
      })
      .catch(function(error){
        console.error("SORRY, AN ERROR OCCURED!", error);
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
        console.log("GUEST DECREMENT: ", guestDecrement);
        /* If current value is above 0, then decrement by 1, otherwise, return 0 */
        return (currentVal > 0 ? currentVal -= guestDecrement : 0);
      })
      .then(function(transactionObj){
        console.log("COMMITED: ", transactionObj);
      })
      .catch(function(error){
        console.log("SORRY AN ERROR HAS OCCURED: ", error);
      })
    }
  }

})
