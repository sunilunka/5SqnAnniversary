app.factory("EventGuestFactory", function(DatabaseFactory, $firebaseObject){
  var eventGuestRef = DatabaseFactory.dbConnection("eventGuests");
  var eventGuestObj = $firebaseObject(eventGuestRef);

  return {
    /* When adding an attendee or guest to event, the attendee id is used as the marker */
    addAttendeeToEventList: (eventId, attendee) => {
      console.log("EVENT GUEST REFERENCE: ", attendee);
      eventGuestRef.child(eventId).update({
          [attendee.$id]: {
            0: attendee.firstName + " " + attendee.lastName
          }
      })
      .then(function(data){
        console.log("DATA WRITTEN: ", data);
      })
      .catch(function(error){
        console.log("SORRY, AN ERROR OCCURED!");
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
