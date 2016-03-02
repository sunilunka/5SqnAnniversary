/* Factory for handling the Application specific authentication flow. */

app.factory("SiteAuthFactory", function($firebaseObject, DatabaseFactory, SessionService, $state){


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
    isRegisteredUser: (authData) => {
      return verifyUserDetails(authData.uid)
      .then(function(userData){
        if(userData) {
          /* Append user id to the returned userData, so it can be used when any reference is made to the SessionService.user */
          userData.id = authData.uid;
          return { currentUser: userData };
        } else {
          return { unregistered: authData };

        }
      })
      .catch(function(error){
        return error;
      })
    },
    /* On Login, create new session and reroute*/
    setSessionAndReRoute: (sessionUserData, toState, params) => {
      /* sessionUserData => Data to populate SessionService.user
        toState => <String>The state that the user shoud be redirected to
        params => An object with URL parameters, when setting session, usually { id: uniqueUserId (uid) }
      */
      console.log("SESSION USER DATA: ", sessionUserData);
      SessionService.createSession(sessionUserData);
      $state.go(toState, params)
    }

  }


})
