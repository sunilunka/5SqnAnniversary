app.factory("GuestOriginFactory", function(DatabaseFactory, $firebaseArray, $firebaseObject){

  var guestOriginRef = DatabaseFactory.dbConnection("guestOrigin");

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

    getOverseasData: () => {
      return guestOriginRef.child("overseas").on("value", function(snapshot){
        console.log("SNAPSHOT: ", snapshot.val());
      })
    }
  }

})
