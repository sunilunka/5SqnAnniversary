app.factory("ManagementFactory", function($firebaseObject, DatabaseFactory){

  var managementRef = DatabaseFactory.dbConnection("managers");
  let managementObj = $firebaseObject(managementRef);
  let usersRef = DatabaseFactory.dbConnection("attendees");

  let ManagementFactory = {};

  ManagementFactory.addManager = (userIdent) => {
    let userRef = DatabaseFactory.dbConnection("attendees/" + userIdent);
    return firebase.Promise.all([
      managementRef.update({ [userIdent]: true }),
      userRef.update({ manager: true })
    ])
  }

  ManagementFactory.removeManager = (userIdent) => {
    let userRef = DatabaseFactory.dbConnection("attendees/" + userIdent);
    return firebase.Promise.all([
      managementRef.update({ [userIdent]: null }),
      userRef.update({ manager: null })
    ])
  }

  ManagementFactory.getManagers = (callback, currentUserKey) => {
    managementRef.on("value", function(snapshot){
      let managementUsers = [];
      snapshot.forEach(function(childSnapshot){
        if(childSnapshot.key !== currentUserKey){
          usersRef.child(childSnapshot.key).on("value", function(snapshot){
            let userData = snapshot.val();
            userData.$id = childSnapshot.key;
            managementUsers.push(userData);
          })
        }
      })
      callback(managementUsers);
    })
  }

  return ManagementFactory;

})
