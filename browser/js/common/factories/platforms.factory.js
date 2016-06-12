app.factory("PlatformsFactory", function(DatabaseFactory, EventFactory, $firebaseArray){

  var platformsRef = DatabaseFactory.dbConnection("platforms");
  var platformsArray = $firebaseArray(platformsRef);

  var createEventKeysObj = function(){
    EventFactory.getEvents()
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
      platformArray.$add({
        label: name,
        total: 0,
        eventTally: createEventKeysObj()
      })
      .then(function(ref){
        console.log("PLATFORM ADDED WITH REF: ", ref);
      })
    },

    removePlatform: function(platformRef){
      platformArray.$remove(platformRef)
      .then(function(ref){
        console.log("PLATFORM WITH REF " +  ref + " REMOVED");
      })
    }
  }

})
