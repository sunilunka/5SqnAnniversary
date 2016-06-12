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
          eventTally: eventsKeyObj
        })
        .then(function(ref){
          console.log("PLATFORM ADDED WITH REF: ", ref);
          return ref;
        })
      })
    },

    removePlatform: function(platform){
      platformsArray.$remove(platform)
      .then(function(ref){
        console.log("PLATFORM WITH REF " +  ref + " REMOVED");
        return ref;
      })
    }
  }

})
