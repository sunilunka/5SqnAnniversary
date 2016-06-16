app.factory("QueryFactory", function(DatabaseFactory){
  let QueryFactory = {};

  let attendeesRef = DatabaseFactory.dbConnection("attendees");

  QueryFactory.getCategoryUsers = (callback, catId) => {
    let catRef = DatabaseFactory.dbConnection(catId);
    let catUsers = [];
    catRef.on("value", function(snapshot){
      snapshot.forEach(function(childSnap){
        attendeesRef.child(childSnap.key).on("value", function(snapshot){
          catUsers.push(snapshot.val());
        })
      })
    })
    callback(catUsers);
  }


  return QueryFactory;
})
