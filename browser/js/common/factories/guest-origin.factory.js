app.factory("GuestOriginFactory", function(DatabaseFactory, ParsingFactory,$firebaseArray, $firebaseObject){

  var guestOriginRef = DatabaseFactory.dbConnection("guestOrigin");
  var attendeesRef = DatabaseFactory.dbConnection("attendees");

  return {
    addGuestToOriginStore: (attendeeData) => {
      if(attendeeData.overseas){
        return guestOriginRef.child("overseas").update({
          [attendeeData.uid]: true
        })
      }
    },

    removeGuestFromOriginStore: (attendeeIdent) => {
      return guestOriginRef.child("overseas").update({
        [attendeeIdent]: null
      })
    },

    getOverseasData: (callback) => {
      return guestOriginRef.child("overseas").on("value", function(snapshot){
        let overseasUsers = [];
        snapshot.forEach(function(childSnapshot){
          attendeesRef.child(childSnapshot.key).on("value", function(snapshot){
            let userData = snapshot.val();
            userData.$id = childSnapshot.key;
            overseasUsers.push(userData);
          })
        })
        callback(overseasUsers);
      })
    },

    overseasAttendeesListener: function(callback){
      guestOriginRef.child("overseas").on("value", function(snapshot){
        let guestCount = 0;
        snapshot.forEach(function(childSnap){
          guestCount += 1;
        })
        callback(guestCount);
      })
    }
  }

})
