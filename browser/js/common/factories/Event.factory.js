app.factory('EventFactory', function($firebaseArray, $firebaseObject, DatabaseFactory, $q, SessionService){
  var eventsRef = DatabaseFactory.dbConnection('events');
  var eventsArray = $firebaseArray(eventsRef);
  var eventsObj = $firebaseObject(eventsRef);

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
      /* isNotFireKey returns a boolean to signal if a key is prefixed by $ or not. '$' denotes an AngularFire method key or property */
      if(objData.hasOwnProperty(key) && isNotFireKey(key)){
        eventList.push(key);
        var ref = DatabaseFactory.dbConnection('events/' + key + '/guests')
        eventGuestObjs[key] = $firebaseObject(ref).$loaded();
      }
    }
    return eventGuestObjs;
  }

  /* Ensure events array is loaded prior to loading events*/

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




  return {
    getEvents: () => {
      return eventsArray.$loaded()
      .then(function(array){
        return array;
      })
    },

    returnEventDetails: (evtObj) => {
      for(var eventKey in evtObj){
        console.log("EVENT OBJ", eventKey)
      }
    },


  /* Test whether there is a $ character in a string. */
  // var isNotFireKey = (prop) => {
  //   var propStr = prop.toString();
  //   var dollarRegEx = /\$/
  //   if(!dollarRegEx.test(propStr)){
  //     return true;
  //   }
  // }
  // /* Initiate a new firebase connection to all events stored in the events object, specifically so the guests object can be updated */
  // var initEventGuestDbConnection = (objData) => {
  //   for(var key in objData){
  //     /* isNotFireKey returns a boolean to signal if a key is prefixed by $ or not. '$' denotes an AngularFire method key or property */
  //     if(objData.hasOwnProperty(key) && isNotFireKey(key)){
  //       eventList.push(key);
  //       var ref = DatabaseFactory.dbConnection('events/' + key + '/guests')
  //       eventGuestObjs[key] = $firebaseObject(ref).$loaded();
  //     }
  //   }
  //   return eventGuestObjs;
  // }

    /* Guests includes the attendee enrolling, default is 1 */
    addAttendeeToEvent: (eventKey, userRef, guests) => {

      return eventsArray.$loaded()
      .then(function(data){
        var eventRecord = eventsArray.$getRecord(eventKey);
        if(eventRecord.hasOwnProperty("guests")){
          eventRecord["guests"][userRef] = guests || 1;
        } else {
          eventRecord["guests"] = {};
          eventRecord["guests"][userRef] = guests || 1;
        }
        return eventsArray.$save(eventsArray.$getRecord(eventKey))
      })
      // resolvedEventGuestObjs[eventName][userRef] = guests || 1;
      // return resolvedEventGuestObjs[eventName].$save()
      //   .then(function(ref){
      //       console.log("SAVED TO EVENT!");
      //   });
    },

    /* Remove user from the Event Guest object*/
    removeAttendeeFromEvent: (eventKey, userRef) => {
      return eventsArray.$loaded()
      .then(function(data){
          let eventToModify = eventsArray.$getRecord(eventKey);
          delete eventToModify.guests[userRef];
          delete eventToModify.attending;
          return eventsArray.$save(eventToModify);
      })
    },
  //
  //   getSingleEventAttendees: (eventName) => {
  //     var attendeesList = $firebaseArray(eventsRef.child(eventName).child("guests"));
  //
  //     return attendeesList.$loaded()
  //     .then(function(data){
  //       console.log("ATTENDEES: ", data);
  //       return data;
  //     });
  //   }
  }

})
