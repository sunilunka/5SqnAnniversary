/* Factory for handling the Application specific authentication flow. */

app.factory("SiteAuthFactory", function($firebaseObject, DatabaseFactory, SessionService, $state, $rootScope){

  var managementRef = DatabaseFactory.dbConnection("managers");
  var managementObj = $firebaseObject(managementRef);

  /* Create a connection to the user identification key. If the key does not exist then no details will be returned. */
  var verifyUserDetails = (id) => {
    /* Change this to firebase query? */
    let usersRef = DatabaseFactory.dbConnection('attendees');
    let usersObject = $firebaseObject(usersRef);

    return usersObject.$loaded()
      .then(function(data){
        var userData = data[id];
        console.log("USER DATA: ", data[id]);
        return userData;
      })
  }

  return {
    /* Function to execute callbacks based on if the user has registered or not. Registered data is stored in the Firebase datastore, no data means the user is not registered */
    isUserRegistered: (authData) => {
      return verifyUserDetails(authData.uid)
      .then(function(userData){
        console.log("USER DATA ", userData)
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
      SessionService.createSession(sessionUserData);
      $rootScope.$broadcast("loggedIn", SessionService.user);
      $state.go(toState, params)
    },

    /* When a user is registering for the first time with external auth provider */

    userRegisterInProgress: (authData) => {
      /* Return register data if available */
      console.log("USER REGISTER IN PROGRESS AUTH DATA: ", authData);
      var newRegisterData = JSON.parse(window.sessionStorage.getItem("registerData"));
      /* If the key the data stored under matches the provider, then return the parsed data. */
      var authProvider = authData.providerData[0].providerId;
      var storedAuthProvider = Object.keys(newRegisterData)[0];
      var providerRegEx = new RegExp(storedAuthProvider);
      if(providerRegEx.test(authProvider)){
        console.log("REGISTERING WITH STORED DATA OBJECT: ", newRegisterData[storedAuthProvider])
        return newRegisterData[storedAuthProvider];
      } else {
        /* Return null if key does not match. */
        return null;
      }
    },

    /* If user is registered then re-route to required state depending on if user is a manager or not. */
    userIsRegistered: (data) => {
      SessionService.createSession(data);
      $rootScope.$broadcast("loggedIn", SessionService.user);
      if(data.hasOwnProperty("manager")){
        managementObj.$loaded()
        .then(function(managementData){
          if(managementData[data.id]){
            $state.go("management")
          }
        })
      } else {
        /* User is registered, go to the appropriate URL, where the id is the url identifier i.e. attendee/{{data.id}}*/
        $state.go("attendee", {id: data.id});
      }
      return;
    },

    userNotRegistered: (authData) => {
      /* If user is trying to login with social media account, but have not registered, send them to referredNewAttendee state */
      if(authData.providerData[0].providerId !== "password"){
        $state.go("referredNewAttendee", {
          provider: authData.providerData[0].providerId,
          referredUid: authData.uid
        });
        return;
      } else {
        $state.go("newAttendee.email");
      }
    }


  }


})
