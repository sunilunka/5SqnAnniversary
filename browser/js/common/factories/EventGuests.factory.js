app.factory("EventGuestsFactory", function(DatabaseFactory, $firebaseObject){
  var eventGuestsRef = DatabaseFactory.dbConnection("eventGuests");
  var eventGuestObj = $firebaseObject(eventGuestsRef);

  return {
    /* When adding an attendee or guest to event, the attendee id is used as the marker */
    addGuestToEvent: (eventId, attendeeId) => {
      
    }
  }

})
