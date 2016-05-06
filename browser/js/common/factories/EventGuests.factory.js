app.factory("EventGuestFactory", function(DatabaseFactory, $firebaseObject){
  var eventGuestRef = DatabaseFactory.dbConnection("eventGuests");
  var eventGuestObj = $firebaseObject(eventGuestRef);

  return {
    /* When adding an attendee or guest to event, the attendee id is used as the marker */
    addAttendeeToEventList: (eventId, attendee) => {
      console.log("EVENT GUEST REFERENCE: ", attendee);
      let attendeeIdent = (attendee.uid || attendee.$id || attendee.id);
      eventGuestRef.child(eventId).update({
          [attendeeIdent]: {
            registeredAttendee: attendee.firstName + " " + attendee.lastName
          }
      })
      .then(function(ref){
        console.log("DATA WRITTEN: ", ref);
        return ref;
      })
      .catch(function(error){
        console.log("SORRY, AN ERROR OCCURED!");
        return error;
      })
    },
    /* Remove an attendee from the eventGuests list. */
    removeAttendeeFromEventList: (eventId, attendee) => {
      eventGuestRef.child(eventId).child(attendee.$id).remove()
      .then(function(data){
        /* No data is returned on successful (resolved promise) removal using standard Firebase Javscript API methods. */
        console.log("DATA REMOVED!", data);
      })
      .catch(function(error){
        return error;
      })
    }
  }

})
