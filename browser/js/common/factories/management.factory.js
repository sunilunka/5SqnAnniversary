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

  ManagementFactory.getCategoryUsers = () => {
    return usersRef.orderByKey().limitToFirst(50)
    .on("value", function(snapshot){
      console.log("CATEGORY SNAPSHOT: ", snapshot.val());
    })
  }

  return ManagementFactory;

})
