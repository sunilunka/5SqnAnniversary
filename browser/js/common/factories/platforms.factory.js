app.factory("PlatformsFactory", function(DatabaseFactory, EventFactory, $firebaseArray){

  var platformsRef = DatabaseFactory.dbConnection("platforms");
  var platformsArray = $firebaseArray(platformsRef);

  var createEventKeysObj = function(){
    return EventFactory.getEvents()
    .then(function(eventsArray){
      let platformEventObj = {};
      eventsArray.forEach(function(evt){
        platformEventObj[evt.$id] = 0;
      })
      return platformEventObj;
    })
  }

  var updatePlatformTotal = function(addOrRemove, platformId){
    return platformsRef.child(platformId).child("total")
    .transaction(function(currentVal){
      if(addOrRemove === "add"){
        return currentVal ++;
      } else if(addOrRemove === "remove"){
        return currentVal === 0 ? 0 : currentVal--;
      }
    })
  }

  var updatePlatformEventTotal = function(addOrRemove, platformId, eventId){
    return platformsRef.child(platformId).child("eventTally").child(eventId)
    .transaction(function(currentVal){
      if(addOrRemove === "add"){
        return currentVal++;
      } else if(addOrRemove === "remove"){
        return currentVal === 0 ? 0 : currentVal--;
      }
    })
  }

  var updatePlatformAttendeeList = function(addOrRemove, attendeeId, platformId){
    var platformListRef = platformsRef.child(platformId).child("associatedAttendees");
    if(addOrRemove === "add"){
      let toSave = {};
      toSave[attendeeId] = true;
      return platformListRef.update(toSave);
    } else if(addOrRemove === "remove"){
      return platformListRef.update({[attendeeId]: null});
    }

  }

  var updatePlatformObject = function(addOrRemove, platformId, eventObj, attendeeId){
    var opsToResolve = [];
      opsToResolve.push(updatePlatformTotal(addOrRemove , platformId));
      opsToResolve.push(updatePlatformAttendeeList(addOrRemove, attendeeId, platformId))
      for(var evt in eventObj){
        opsToResolve.push(updatePlatformEventTotal(addOrRemove, platformId, evt))
      }
    return firebase.Promise.all(opsToResolve);
  }

  return {

    getPlatforms: function(){
      return platformsArray.$loaded()
      .then(function(platformsArray){
        return platformsArray;
      })
    },

    addPlatform: function(name){
      return createEventKeysObj()
      .then(function(eventsKeyObj){
        platformsArray.$add({
          label: name,
          total: 0,
          eventTally: eventsKeyObj,
          associatedAttendees: false
        })
        .then(function(ref){
          console.log("PLATFORM ADDED WITH REF: ", ref);
          return ref;
        })
      })
    },

    removePlatform: function(platform){
      return platformsArray.$remove(platform)
      .then(function(ref){
        console.log("PLATFORM WITH REF " +  ref + " REMOVED");
        return ref;
      })
    },

    /* Update the name of a platform */
    updatePlatform: function(platform_id, revisedLabel){
      var platformRef = DatabaseFactory.dbConnection("platforms/" + platform_id);
      return platformRef.update({ label: revisedLabel });
    },

    /* Update the total of a/each platform once a user has registered.
      => Platforms array is an array of $id's that will be use to set the route.
     */
    addAttendeeToPlatforms: function(platformsArray, userEventObj, attendeeId){
      var toResolve = platformsArray.map(function(platformId){
        return updatePlatformObject("add", platformId, userEventObj, attendeeId);
      })
      console.log("TO RESOLVE: ", toResolve)

      return firebase.Promise.all(toResolve);
    },

    removeAttendeeFromPlatforms: function(platformsArray, userEventObj, attendeeId){
      var toResolve = platformsArray.map(function(platformId){
        return updatePlatformObject("remove", platformId, userEventObj, attendeeId)
      })
      return firebase.Promise.all(toResolve);
    },

    removeFromEventTally: function(userPlatformObj, eventId){
      var toResolveAndRemove = [];
      for(var platformId in userPlatformObj){
        toResolveAndRemove.push(updatePlatformEventTotal("remove", platformId, eventId));
      }
      return firebase.Promise.all(toResolveAndRemove);
    },

    addToEventTally: function(userPlatformObj, eventId){
      var toResolveAndAdd = [];
      for(var platformId in userPlatformObj){
        toResolveAndAdd.push(updatePlatformEventTotal("add", platformId, eventId));
      }
      return firebase.Promise.all(toResolveAndAdd);
    }
  }
})
