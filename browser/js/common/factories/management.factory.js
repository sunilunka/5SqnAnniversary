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

  ManagementFactory.getManagers = (callback) => {
    managementRef.on("value", function(snapshot){
      let managementUsers = [];
      snapshot.forEach(function(childSnapshot){
        usersRef.child(childSnapshot.key).on("value", function(snapshot){
          let userData = snapshot.val();
          userData.$id = childSnapshot.key;
          managementUsers.push(userData);
        })
      })
      callback(managementUsers);
    })
  }

  return ManagementFactory;

})
