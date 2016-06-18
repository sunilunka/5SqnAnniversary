app.factory("QueryFactory", function(DatabaseFactory){
  let QueryFactory = {};

  let attendeesRef = DatabaseFactory.dbConnection("attendees");

  QueryFactory.getCategoryUsers = (callback, catId, currentUserKey) => {
    let catRef = DatabaseFactory.dbConnection(catId);
    let catUsers = [];
    catRef.on("value", function(snapshot){
      snapshot.forEach(function(childSnap){
          if(childSnap.key !== currentUserKey){
            attendeesRef.child(childSnap.key).on("value", function(snapshot){
              let userData = snapshot.val();
              userData.$id = childSnap.key;
              catUsers.push(userData);
            })
          }
        })
      callback(catUsers);
    })
  }

  QueryFactory.getPlatformUsers = (callback, associatedUsers, currentUserKey) => {
    let correlatedUsers = [];
    if(associatedUsers){
      associatedUsers = Object.keys(associatedUsers);
      associatedUsers.map(function(id){
        if(id !== currentUserKey){
          attendeesRef.child(id).on("value", function(snapshot){
            let userData = snapshot.val();
            userData.$id = id;
            correlatedUsers.push(userData);
          })
        }
      })
    }
    callback(correlatedUsers);
  }

  QueryFactory.getEventUsers = (callback, evtId, currentUserKey) => {
    let eventGuestRef = DatabaseFactory.dbConnection("eventGuests");
    let populatedArray = [];
    eventGuestRef.child(evtId).on("value", function(snapshot){
      snapshot.forEach(function(childSnapshot){
        let userKey = childSnapshot.key
        if(userKey !== currentUserKey){
          attendeesRef.child(userKey).on("value", function(snapshot){
            let userData = snapshot.val();
            userData.$id = userKey;
            populatedArray.push(userData);
          })
        }
      })
      callback(populatedArray);
    })
  }

  return QueryFactory;
})
