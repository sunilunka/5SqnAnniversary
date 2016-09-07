app.factory("EventGuestFactory", function(DatabaseFactory, $firebaseObject, $firebaseArray, $http){
  var eventGuestRef = DatabaseFactory.dbConnection("eventGuests");
  var eventGuestObj = $firebaseObject(eventGuestRef);
  var attendeesRef = DatabaseFactory.dbConnection("attendees");

  return {
    /* When adding an attendee or guest to event, the attendee id is used as the key */
    addAttendeeToEventList: (eventId, attendee) => {
      /* Multiple options for attendee Ident based on register method */
      let attendeeIdent = (attendee.uid || attendee.$id || attendee.id);
      return eventGuestRef.child(eventId).update({
          [attendeeIdent]: {
            registeredAttendee: attendee.firstName + " " + attendee.lastName
          }
      })
      .then(function(ref){
        return ref;
      })
      .catch(function(error){
        return error;
      })
    },
    /* Remove an attendee from the eventGuests list. */
    removeAttendeeFromEventList: (eventId, attendee) => {
      return eventGuestRef.child(eventId).child(attendee.$id).remove()
      .then(function(data){
        /* No data is returned on successful (resolved promise) removal using standard Firebase Javscript API methods. */
        return data;
      })
      .catch(function(error){
        return error;
      })
    },

    getAllEventAttendees: (eventId) => {
      return eventGuestRef.child(eventId).once("value")
      .then(function(snapshot){
        var guestDetails = [];
        snapshot.forEach(function(childSnap){
          var guests = [];
          var guestListEntry = childSnap.val();
          for(var personId in guestListEntry){
            if(personId !== "registeredAttendee"){
              guests.push(guestListEntry[personId]);
            }
          }
          guestDetails.push(attendeesRef.child(childSnap.key).once("value")
          .then(function(attendeeSnap){
            var attendeeInfo = attendeeSnap.val();
            attendeeInfo.$id = childSnap.key;
            attendeeInfo["eventGuestList"] = {};
            attendeeInfo["eventGuestList"][eventId] = guests;
            return attendeeInfo;
          }));
        })
        return firebase.Promise.all(guestDetails);
      })
    },

    getSingleGuestListObject: (eventId, attendeeId) => {
      return $firebaseObject(eventGuestRef.child(eventId).child(attendeeId))
      .$loaded()
      .then(function(obj){
        return obj;
      })
    },

    getEventGuestList: (eventId) => {
      return $http.get(DatabaseFactory.generateApiRoute('generated-files/guest-list/' + eventId))
      .then(function(response){
        console.log("RESPONSE: ", response);
        return response.data;
      })
    }

  }

})
