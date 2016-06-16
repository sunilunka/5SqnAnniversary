app.factory("GuestOriginFactory", function(DatabaseFactory, $firebaseArray, $firebaseObject){

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
        let overseasUsers = []
        snapshot.forEach(function(childSnapshot){
          attendeesRef.child(childSnapshot.key).on("value", function(snapshot){
            overseasUsers.push(snapshot.val());
          })
        })
        callback(overseasUsers);
      })
    }
  }

})
