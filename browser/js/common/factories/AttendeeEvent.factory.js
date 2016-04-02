app.factory("AttendeeEventFactory", function($firebaseObject, $firebaseArray, DatabaseFactory, EventFactory){

  var eventGuestLists = DatabaseFactory.dbConnection("eventGuests");

  return {
    /* For all methods use path argument, it takes a string denoting the path of the firebase record to use to modify a record*/

    guestEventRef: (path) => {
      return DatabaseFactory.dbConnection(path);
    },
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
          .then(function(data){
            return EventFactory.addAttendeeToEvent(evtId, attendeeId);
          })
        },

        removeGuest: (guestId) => {
          var guestEventRef = DatabaseFactory.dbConnection("eventGuests/" + evtId + "/" + attendeeId + "/" + guestId);

          guestEventRef.remove()
          .then(function(data){
            EventFactory.removeAttendeeFromEvent(evtId, attendeeId);
          })
          .catch(function(error){
            console.error("Sorry an error occured: ", error)
          })
        }
      }
    },

    getAttendeeGuestCount: (evtId, attendeeId) => {
      let guestEventRef = DatabaseFactory.dbConnection("eventGuests/" + evtId + "/" + attendeeId);
      return $firebaseArray(guestEventRef)
      .$loaded()
      .then(function(data){
        return data.length;
      })
    }
  }


})
