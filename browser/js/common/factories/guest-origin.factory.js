app.factory("GuestOriginFactory", function(DatabaseFactory, $firebaseArray, $firebaseObject){

  var guestOriginRef = DatabaseFactory.dbConnection("guestOrigin");

  return {
    addGuestToOriginStore: (attendeeData) => {
      if(attendeeData.overseas){
        ref.child("overseas").update({
          [attendeeData.id]: true
        })
      }
    },

    removeGuestFromOriginStore: (attendeeIdent) => {
      ref.child("overseas").update({
        [attendeeIdent]: null
      })
    }
  }

})
