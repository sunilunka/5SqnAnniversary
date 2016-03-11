app.factory('EventFactory', function($firebaseArray, $firebaseObject, DatabaseFactory, $q){
  var eventsRef = DatabaseFactory.dbConnection('events');
  var eventsObject = $firebaseObject(eventsRef);

  var eventGuestObjs = {};

  var resolvedEventGuestObjs;

  /* Test whether there is a $ character in a string. */
  var isNotFireKey = (prop) => {
    var propStr = prop.toString();
    var dollarRegEx = /\$/
    if(!dollarRegEx.test(propStr)){
      return true;
    }
  }
  /* Initiate a new firebase connection to all events stored in the events object, specifically so the guests object can be updated */
  var initEventGuestDbConnection = (objData) => {
    for(var key in objData){
      if(objData.hasOwnProperty(key) && isNotFireKey(key)){
        var ref = DatabaseFactory.dbConnection('events/' + key + '/guests')
        eventGuestObjs[key] = $firebaseObject(ref).$loaded();
      }
    }
    return eventGuestObjs;
  }

  /* Resolve all promises before populating resolvedEventGuestObjs */
  var promisifyEventGuestObjects = (object) => {
    object.$loaded()
    .then(function(data){
      /* Only populate resolved dbroutes when all promises have resolved*/
      var stuff = $q.all(initEventGuestDbConnection(data))
      .then(function(data){
          resolvedEventGuestObjs = data;
      })
      .catch(function(error){
        return error;
      })
    });
  }

  promisifyEventGuestObjects(eventsObject);

  /* If there are no event keys in the database, create them so there are records to use (FOR TESTING ONLY)*/

  var checkExistsOrCreate = (events) => {
    events.forEach((eventName) => {
      if(!eventsObject.hasOwnProperty(eventName)){
        eventsObject[eventName] = { '01234567890': '0' };
        eventsObject.$save()
        .then(function(ref){
          console.log("NO EVENTS IN DB, CREATED NOW: ", eventsObject);
        })
      } else {
        return;
      }
    })
  }

  eventsObject.$loaded()
  .then(function(){
    checkExistsOrCreate(['openday', 'dinner']);
  });

  return {

    /* Add an event to the database */
    addEvent: (name) => {
      /* Need to prompt for event details */
      eventsObject[name] = {};
      eventsObject.$save()
      .then(function(ref){
        console.log('new event created!');
        return true;
      })
    },

    saveToEventDb: () => {
      /* Save the eventsObject once a new event has been created */
      return eventsObject.$save();
    },

    /* Guests includes the attendee enrolling, default is 1 */
    addAttendeeToEvent: (eventName, userRef, guests) => {
      resolvedEventGuestObjs[eventName][userRef] = guests || 1;
      return resolvedEventGuestObjs[eventName].$save()
        .then(function(ref){
            console.log("SAVED TO EVENT!");
        });
    },

    removeAttendeeFromEvent: (eventName, userRef) => {
      delete eventsObject[eventName]["guests"][userRef];
      console.log("EVENTS OBJECT: ", eventsObject);
      eventsObject.$save()
      .then(function(ref){
        console.log("REMOVE SUCCESS!");
        return ref;
      })
      .catch(function(error){
        return error;
      })
    },

    getSingleEventAttendees: (eventName) => {
      var attendeesList = $firebaseArray(eventsRef.child(eventName).child("guests"));

      return attendeesList.$loaded()
      .then(function(data){
        console.log("ATTENDEES: ", data);
        return data;
      });
    }
  }

})
