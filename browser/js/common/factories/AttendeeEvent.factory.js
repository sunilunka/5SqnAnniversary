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

    modifyEventGuestList: (evtId, attendeeData) => {
      /* Capture attendee id in a variable, as firebase does not allow object referencng when finding a route to a db key */
      console.log("ATTENDEE DATA: ", attendeeData)
      let attendeeId = attendeeData.$id || attendeeData.uid;
      let eventList = eventGuestLists.child(evtId).child(attendeeId);
      return {
        addGuest: (guestKey, guestName) => {
          return firebase.Promise.all([eventList.update({
            [guestKey]: guestName
          }), EventFactory.addAttendeeToEvent(evtId, attendeeData)]);

        },

        removeGuest: (guestId) => {
          var guestEventRef = DatabaseFactory.dbConnection("eventGuests/" + evtId + "/" + attendeeId + "/" + guestId);

          return guestEventRef.remove()
          .then(function(data){
            return EventFactory.removeAttendeeFromEvent(evtId, attendeeData);
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
    },
    /* This method is used in the attendee state events options and does not act specifically on the attendee -> events db fields. */
    checkSeatsAvailable: (evtId, association, callback) => {
      let evtGuestsRef = DatabaseFactory.dbConnection("events/" + evtId + "/guests/" + association);
      evtGuestsRef.on("value", function(snapshot){
        let refValue = snapshot.val();
        /* refValue is the value of the event guests for the users association in a key value object. Callback is a function that acts on the returned value. */
        callback(refValue)
      })
    },
    /* May not require this, will look at it when testing user data flows. */
    checkSeatsOnLimitChange: (evtId, association, callback) => {
      let limitRef = DatabaseFactory.dbConnection("events/" + evtId);
    },

    removeGuestFromAttendeeEvent: (attendeeData, evtId, guestId) => {
      var attendeeEventGuestRef = DatabaseFactory.dbConnection("attendees/" + attendeeData.$id + "/events/" + evtId + "/" + guestId);
      return attendeeEventGuestRef.remove()
    }

  }


})
