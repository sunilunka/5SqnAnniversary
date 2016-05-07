app.factory('EventFactory', function($firebaseArray, $firebaseObject, DatabaseFactory, $q, SessionService, EventGuestFactory){
  var eventsRef = DatabaseFactory.dbConnection('events');
  var eventsArray = $firebaseArray(eventsRef);
  var eventsObj = $firebaseObject(eventsRef);

  // /* Test whether there is a $ character in a string. */
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
  //
  // /* Ensure events array is loaded prior to loading events*/
  //
  // /* Resolve all promises before populating resolvedEventGuestObjs */
  // var promisifyEventGuestObjects = (object) => {
  //   object.$loaded()
  //   .then(function(data){
  //     /* Only populate resolved dbroutes when all promises have resolved*/
  //     var stuff = $q.all(initEventGuestDbConnection(data))
  //     .then(function(data){
  //         resolvedEventGuestObjs = data;
  //     })
  //     .catch(function(error){
  //       return error;
  //     })
  //   });
  // }


  return {
    getEvents: () => {
      return eventsArray.$loaded()
      .then(function(eventsArray){
        return eventsArray;
      })
    },

    returnEventDetails: (evtObjId) => {
      return eventsArray.$loaded()
      .then(function(data){
        return data.$getRecord(evtObjId)
      });
    },

    removeEvent: (evtObjId) => {
      return eventsArray.$remove(evtObjId)
      .then(function(ref){
        console.log("EVENT REMOVED: ", ref);
        return ref;
      })
    },

    addEvent: (eventData) => {
      return eventsArray.$add(eventData)
      .then(function(ref){
        console.log("EVENT ADDED: ", ref)
        return ref;
      })
    },

    saveEvent: (eventData) => {
      return eventsArray.$save(eventData)
      .then(function(ref){
        console.log("UPDATE SAVED: ", ref);
        return ref;
      })

    },

    /* Guests includes the attendee enrolling, default is 1. Transaction is required to ensure data is written to database in the event multiple writes are being attempted to this guests key */
    addAttendeeToEvent: (eventKey, userData, guests) => {
      /* Cannot use object dot or bracket notation in paths for Firebase db. */
      let userAssociation = userData.association;
      return eventsRef.child(eventKey)
      .child("guests").child(userAssociation).transaction(function(currentVal){
        return currentVal += 1;
      })
      .then(function(transactionObj){
        console.log("VALUE RETURNED IN PROMISE: ", transactionObj);
        return transactionObj;
      })
      .catch(function(error){
        console.error("SORRY, AN ERROR OCCURED!", error);
      })
    },

    /* Remove user from the Event Guest object*/
    removeAttendeeFromEvent: (eventKey, userData, numGuestsToRemove) => {
      /* Cannot use object dot or bracket notation in paths for Firebase db. */
      let userAssociation = userData.association;
      return eventsRef
      .child(eventKey)
      .child("guests")
      .child(userAssociation)
      .transaction(function(currentVal){
        /* If the number of guests to remove is not specified assume only one guest is being removed. */
        let guestDecrement = numGuestsToRemove ? numGuestsToRemove : 1;
        console.log("GUEST DECREMENT: ", guestDecrement);
        /* If current value is above 0, then decrement by 1, otherwise, return 0 */
        return (currentVal > 0 ? currentVal -= guestDecrement : 0);
      })
      .then(function(transactionObj){
        console.log("COMMITED: ", transactionObj);
      })
      .catch(function(error){
        console.log("SORRY AN ERROR HAS OCCURED: ", error);
      })
    }
  }

})
