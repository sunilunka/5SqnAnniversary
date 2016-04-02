app.factory("AttendeeEventFactory", function($firebaseObject, $firebaseArray, DatabaseFactory){

  var eventGuestLists = DatabaseFactory.dbConnection("eventGuests");

  return {
    /* path takes a string denoting the path of the firebase record to use */
    arrayToModify: (path) => {
      let guestEventRef = DatabaseFactory.dbConnection(path);
      return $firebaseArray(guestEventRef);
    },

    /* Modify event object using standard javascript firebase methods */
    objectToModify: (path) => {
      let guestEventRef = DatabaseFactory.dbConnection(path);
      return $firebaseObject(guestEventRef);
    },

    modifyEventGuestList: (evtId, attendeeId) => {
      let eventList = eventGuestLists.child(evtId).child(attendeeId);
      return {
        addGuest: (guestKey, guestName) => {
          return eventList.update({
            [guestKey]: guestName
          })
        },

        removeGuest: (guestId) => {
          var guestEventRef = DatabaseFactory.dbConnection("eventGuests/" + evtId + "/" + attendeeId + "/" + guestId);
          guestEventRef.remove()
          .then(function(data){
            console.log("USER REMOVED FROM GUEST LIST: ", data);
          })
          .catch(function(error){
            console.error("Sorry an error occured: ", error)
          })
        }
      }
    },

    addGuestToEventGuestList: (evtId, attendeeId, guest) => {
      eventGuestLists
      .child(evtId)
      .child(attendeeId)
      .update({
        [guest.$id]: guest.$value
      })
      .then(function(data){
        console.log("USER ADDED TO EVENT GUEST LIST: ", data);

      })
    },

    removeGuestFromEventGuestList: (evtId, attendId, guestId) => {
      eventGuestLists.child(evtId)
    }
  }


})
