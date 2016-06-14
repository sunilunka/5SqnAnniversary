app.factory("ManagementFactory", function($firebaseObject, DatabaseFactory){

  var managementRef = DatabaseFactory.dbConnection("managers");
  let managementObj = $firebaseObject(managementRef);

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



  return ManagementFactory;

})
