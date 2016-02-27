/* Factory for handling the Application specific authentication flow. */

app.factory("SiteAuthFactory", function($firebaseObject, DatabaseFactory, SessionService){


  /* Create a connection to the user identification key. If the key does not exist then no details will be returned. */
  var verifyUserDetails = (id) => {
    let usersRef = DatabaseFactory.dbConnection('attendees');
    let usersObject = $firebaseObject(usersRef)

    return usersObject.$loaded()
      .then(function(data){
        let userData = data[id];
        return userData;
      })
      .catch(function(error){
        return error;
      })
  }

  return {
    /* Function to execute callbacks based on if the user has registered or not. Registered data is stored in the Firebase datastore, no data means the user is not registered */
    isRegisteredUser: (authData, dataCallback, noDataCallback) => {
      return verifyUserDetails(authData.uid)
      .then(function(userData){
        if(userData) {
          dataCallback(userData);
          return true;
        } else {
          noDataCallback(authData);
          return false;

        }
      })
      .catch(function(error){
        return error;
      })
    }

  }


})
