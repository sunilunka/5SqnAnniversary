app.factory('EventFactory', function($firebaseArray, $firebaseObject, DatabaseFactory){
  var eventsRef = DatabaseFactory.dbConnection('events');
  var eventsObject = $firebaseObject(eventsRef);
  /* If there are no event keys in the database, create them so there are records to use (FOR TESTING ONLY)*/
  var checkExistsOrCreate = (events) => {
    events.forEach((event) => {
      if(!eventsObject.hasOwnProperty(event)){
        eventsObject[event] = { '01234567890': '0' };
        eventsObject.$save()
        .then(function(ref){
          console.log("NO EVENTS IN DB, CREATED NOW: ", eventsObject);
        })
      }
    })
  }

  eventsObject.$loaded()
  .then(function(){
    checkExistsOrCreate(['openday', 'dinner']);
  });

  return {
    addEvent: (name) => {
      eventsObject[name] = {};
      eventsObject.$save()
      .then(function(ref){
        console.log('new event created!');
        return true;
      })
    },
    /* Guests includes the attendee enrolling, default is 1 */
    addAttendeeToEvent: (eventName, userRef, guests) => {
      // If guests is not provided, default to 1 guest.
      eventsObject[eventName][userRef] = guests || 1;
      return eventsObject.$save()
      .then(function(ref){
        console.log("ADD SUCCESS!")
        return ref;
      })
      .catch(function(error){
        return error;
      })
    },

    removeAttendeeFromEvent: (eventName, userRef) => {
      delete eventObject[eventName][userRef];
      eventsObject.$save()
      .then(function(ref){
        console.log("REMOVE SUCCESS!");
        return true;
      })
      .catch(function(error){
        return error;
      })
    },

    getSingleEventAttendees: (eventName) => {
      var attendeesList = $firebaseArray(eventsRef.child(eventName));

      return attendeesList.$loaded()
      .then(function(){
        console.log("ATTENDEES: ", attendeesList);
        return attendeesList;
      });
    }
  }

})
