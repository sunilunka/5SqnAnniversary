app.factory("EventGuestFactory", function(DatabaseFactory, $firebaseObject, $firebaseArray){
  var eventGuestRef = DatabaseFactory.dbConnection("eventGuests");
  var eventGuestObj = $firebaseObject(eventGuestRef);

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
      return $firebaseArray(eventGuestRef.child(eventId)).$loaded()
      .then(function(results){
        return results;
      })
    }
  }

})
