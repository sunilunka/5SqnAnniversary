app.factory("RegisterFactory", function(UserAuthFactory, EventFactory, DatabaseFactory, $q){

  var promisifyAuthData = () => {
    return $q(function(resolve, reject){
      var serverAuthRef = DatabaseFactory.authConnection();
      var serverAuthData = serverAuthRef.$getAuth();
      if(serverAuthData){
        resolve(serverAuthData);
      } else {
        reject(new Error({ Error: "No auth data returned from server!"}));
      }
    })
  }

  var parseFbData = (authData, formData) => {
    var dataPath = authData.facebook.cachedUserProfile;
    return {
      uid: authData.uid,
      firstName: dataPath.first_name,
      lastName: dataPath.last_name,
      fbprofile: dataPath.link,
      association: formData.association,
      events: formData.events
    }
  }

  var parseEmailData = (authData, formData) => {
    return {
      uid: authData.uid,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      association: formData.association,
      events: formData.events
  }
}


  return {
    /* Function that takes a string describing a method as the first argument. the second argument is primarily for auth by email and password.
      => authData takes an object with the keys 'email' and 'password' and associated values.
      => AuthData also contains all other data the attendee has entered into the form and needs to be included for operations once a new user had successfully been created.
    */
    registerNewUser: (method, userData) => {
      console.log("METHOD: ", method);
      console.log("DATA: ", userData);
      switch(method){
        case "email":
         /* Create new user in database based on provided email and password */
         return UserAuthFactory.createNew({
           email: userData.email,
           password: userData.password
         })
          .then(function(data){
          /* Data returned from creating a new user with email and password => just uid */
            return parseEmailData(data, userData);
          })
          .then(function(userInfo){
            return addUserToEvents(userInfo)
              .then(function(savedEvents){
                return userInfo;
              })
          })
          .catch(function(error){
            return error;
          })
        break;
        case "facebook":
          return UserAuthFactory.loginWithExternalProvider(method)
            .then(function(data){
              return parseFbData(data, userData);
            })
            .then(function(userInfo){
              return addUserToEvents(userInfo)
                .then(function(savedEvents){
                  return userInfo;
                })
            })
            .catch(function(error){
              return error;
            })
          break;
        case "google":
          return UserAuthFactory.loginWithExternalProvider(method);
          break;
        default:
          return new Error("Sorry, a server error has occured!");
          break;
      }
    },

    registerReferredUser: (formData) => {
      return promisifyAuthData()
      .then(function(authData){
        return parseFbData(authData, formData);
      })
    },

    /* Object to save user to events object */
    addUserToEvents: (userData) => {
      /* If no event has been selected (the fields have not been touched => 'pristine') then create a new empty object to continue. This is an isolated case, as there is validation on the form. */
      var recordsToSave = [];
      if(!userData.events) userData.events = {};
      let eventObj = userData.events;
      /* If object has no keys, return */
      /* For each object key, check it exists, if so, add to selected event*/
      for(var eventName in eventObj){
        /* Use the Event Factory to makes changes to local firebase instance for each key in the events object. If it is true, addAttendeeToEvent */
        console.log("EVENT TO USE: ", eventName);
        if(eventObj[eventName]){
          recordsToSave.push(EventFactory.addAttendeeToEvent(eventName, userData.uid));
        }
      }
      /* Return the result of all saved event records on resolution or rejection */
      return $q.all(recordsToSave);

    }
  }

})
