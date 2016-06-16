/* Factory for handling the Application specific authentication flow. */

app.factory("SiteAuthFactory", function($firebaseObject, DatabaseFactory, SessionService, $state, $rootScope, NotificationService){

  var managementRef = DatabaseFactory.dbConnection("managers");
  var attendeesRef = DatabaseFactory.dbConnection("attendees");

  var setUserOnline = function(sessionUserData){
    let userId = sessionUserData.uid || sessionUserData.$id || sessionUserData.id;
    return attendeesRef.child(userId).child("online")
    .transaction(function(currentVal){
      return true;
    })
    .then(function(data){
      NotificationService.notify("success", "Logged in");
    })
    .catch(function(error){
      NotificationService.notify("error", "Sorry, it looks likes we haven't been able to set you as online, you are logged in.")
    })
  }
  /* Create a connection to the user identification key. If the key does not exist then no details will be returned. */
  var verifyUserDetails = (id) => {
    /* Change this to firebase query? */
    let usersRef = DatabaseFactory.dbConnection('attendees');
    let usersObject = usersRef.orderByKey().equalTo(id);

    return new Promise(function(fulfill, reject){
      usersObject.on("value", function(snapshot){
        let userData = snapshot.val();
        if(!userData) {
          fulfill(null);
        } else {
          /* If snapshot returns an object, key is the requested id.*/
          fulfill(userData[id]);
        }
      }, function(err){
        reject(err);
      })
    });
  }

  return {
    /* Function to execute callbacks based on if the user has registered or not. Registered data is stored in the Firebase datastore, no data means the user is not registered */
    isUserRegistered: (authData) => {
      return verifyUserDetails(authData.uid)
      .then(function(userData){
        if(userData) {
          /* Append user id to the returned userData, so it can be used when any reference is made to the SessionService.user */
          userData.uid = authData.uid;
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
        params => An object with URL parameters, when setting session, usually { uid: uniqueUserId (uid) }
      */
      SessionService.createSession(sessionUserData);
      $rootScope.$broadcast("loggedIn", SessionService.user);
      $state.go(toState, params)
      setUserOnline(SessionService.user);
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
      let userId = (data.id || data.uid || data.$id);
      $rootScope.$broadcast("loggedIn", SessionService.user);
      if(data.hasOwnProperty("manager")){
        managementRef.child(userId).on("value", function(snapshot){
          let inManagerTable = snapshot.val();
          if(inManagerTable){
            $state.go("management")
          }
        })
      } else {
        /* User is registered, go to the appropriate URL, where the id is the url identifier i.e. attendee/{{data.id}}*/
        $state.go("attendee", {id: userId});
      }
      /* Set user online regardless of if manager or not. */
      return setUserOnline(SessionService.user);

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
