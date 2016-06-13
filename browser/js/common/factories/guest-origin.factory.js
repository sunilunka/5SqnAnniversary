app.factory("GuestOriginFactory", function(DatabaseFactory, $firebaseArray, $firebaseObject){

  var guestOriginRef = DatabaseFactory.dbConnection("guestOrigin");

  return {
    addGuestToOriginStore: (attendeeData) => {
      if(attendeeData.overseas){
        guestOriginRef.child("overseas").update({
          [attendeeData.uid]: true
        })
      }
    },

    removeGuestFromOriginStore: (attendeeIdent) => {
      guestOriginRef.child("overseas").update({
        [attendeeIdent]: null
      })
    }
  }

})
