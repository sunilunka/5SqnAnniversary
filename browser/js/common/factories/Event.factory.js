app.factory('EventFactory', function($firebaseArray, $firebaseObject, DatabaseFactory){
  var eventsRef = DatabaseFactory.dbConnection('events');
  var eventObject = $firebaseObject(eventsRef);

  return {
    addEvent: (name) => {
      eventObject[name] = {};
      eventObject.$save()
      .then(function(ref){
        console.log('new event created!');
      })
    },

    addAttendeeToEvent: (eventName, guests) => {
      eventObject[eventName][userRef] = guests;
    }
  }

})
