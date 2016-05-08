app.factory("RegisterFactory", function($firebaseObject, UserAuthFactory, EventFactory, DatabaseFactory, $q, EventGuestFactory, GuestOriginFactory, GuestCategoryFactory){
  var attendeesRef = DatabaseFactory.dbConnection('attendees');
  var attendeeObject = $firebaseObject(attendeesRef);


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

  /* Change event data to what is required in the schema. Because a user cannot allocate guests until they have registered, the default guestCount will always be one. */
  var modifyEventData = (userEventObj, firstName, lastName) => {
    console.log("USER EVENT OBJECT: ", userEventObj);
    for(var evt in userEventObj){
      /* Covers both null, true and false values that may be returned from form */
      if(userEventObj.hasOwnProperty(evt)){
        /* If user has selected and then deselected check box, remove event from event list. */
        if(!userEventObj[evt]){
          delete userEventObj[evt];
        } else {
          userEventObj[evt] = "No guests"
        }
      }
    }
    return userEventObj;
  }

  var storeRegisterDataForRedirect = (method, registerData) => {

    var toStore = {}
    /* Primary key for register data is provider name to allow parsing by correct method */
    toStore[method] = registerData;
    var storePrepped = JSON.stringify(toStore);
    if (window.sessionStorage){
      window.sessionStorage.setItem("registerData", storePrepped);
      console.log("DATA STORED: ", window.sessionStorage)
    }
  }

  /* attendeeObject is the firebaseObject of the attendee db table. newUser is the parsed data to be saved to the firebase backend */
  var saveUserDetailsToDb = (attendeeObject, newUser) => {
    console.log('NEW USER CREATED: ', newUser);
    if(!newUser) return new Error("No user created!");
    let userId = newUser.uid;
    /* Remove uid key and value from object so that it is not stored. It is used as the overall object key in the attendees schema.  */
    delete newUser.uid;
    return attendeesRef.update({
      [userId]: newUser
    })
    .then(function(ref){
      console.log("OBJECT SAVED");
      /* return newUser object, with uid field as it is used for registering events */
      newUser.uid = userId;
      /* Remvoe sessionStorage data as a resolved promise means data has been written to the database. */
      if(window.sessionStorage.hasOwnProperty("registerData")) window.sessionStorage.removeItem("registerData");
      /* No 'ref' value is returned when using the .update method of the Firebase API. Entering this resolved stage means update was successful, return the newUser object. */
      return newUser;
    });
  }

  var parseFbData = (authData, formData) => {
    var dataPath = authData.facebook.cachedUserProfile;

    return {
      uid: authData.uid,
      firstName: dataPath.first_name,
      lastName: dataPath.last_name,
      fbprofile: dataPath.link,
      association: formData.association,
      events: modifyEventData(formData.events, dataPath.first_name, dataPath.last_name)
    }
  }

  var parseEmailData = (authData, formData) => {
    return {
      uid: authData.uid,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      association: formData.association,
      events: modifyEventData(formData.events, formData.firstName, formData.lastName)
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
            return saveUserDetailsToDb(attendeeObject, userInfo)
          })
          .catch(function(error){
            return error;
          })
        break;
         default:
          storeRegisterDataForRedirect(method, userData);
          return UserAuthFactory.loginWithExternalProvider(method)
            .then(function(){
              /* Nothing will occur here as Firebase OAuthRedirect promise is negated by the site redirect. This is instead captured on when listening for the OAuth event once login is complete.*/
            })
            .catch(function(error){
              return error;
            })
          break;
      }
    },
    /* If a user has tried to login, but has not registered, get their auth data with promisifyAuthData method (as their login details are stored in the firebase auth store.) */
    registerReferredUser: (formData) => {
      return promisifyAuthData()
      .then(function(authData){
        /* Once firebase authentication has been returned, merge with formData for saving into firebase attendee store */
        if(authData.provider === "facebook"){
          return parseFbData(authData, formData);
        } else if(authData.provider === "password"){
          /* To be completed, full function flow not complete, referred attendee state needs firstName and lastName fields for email */
          return parseEmailData(authData, formData);
        } else {
          return new Error("No provider data found!")
        }
      })
    },

    /* Function that parses and saves user to database. */

    /* Function to save user to events object. Key is user uid, value is true */
    addUserToEvents: (userData) => {
      /* If no event has been selected (the fields have not been touched => 'pristine') then create a new empty object to continue. This is an isolated case, as there is validation on the form. */
      console.log("USER DATA FOR USE: ", userData);
      var recordsToSave = [];
      if(!userData.events) userData.events = {};
      let eventObj = userData.events;
      /* For each object key, check it exists, if so, add to selected event*/
      for(var eventId in eventObj){
        /* Use the Event Factory to makes changes to local firebase instance for each key in the events object. If it is true, addAttendeeToEvent */
        console.log("EVENT TO USE: ", eventId, userData);
        if(eventObj.hasOwnProperty(eventId) && eventObj[eventId]){
            /* Push unresolved adding attendee to event promise to array*/
            recordsToSave.push(EventFactory.addAttendeeToEvent(eventId, userData));
            /* Push unresolved adding attendee name to event guest list to array */
            recordsToSave.push(EventGuestFactory.addAttendeeToEventList(eventId, userData))
        }
      }
      /* Return the result of all reolved promises in array saved event records on resolution or rejection. Using this method means if one promise fails, then all promises will be rejected.  */
      console.log("EVENTS TO SAVE TO DB: ", recordsToSave);
      return $q.all(recordsToSave);

    },

    /* Function to save user data to window.SessionStorage on redirect, as the resolved promise does not return any data due to OAuth Redirect */

    newUserRegisterFromExternalProvider: (authData, registerFormData) => {

      switch(authData.provider){
        case "facebook":
          return parseFbData(authData, registerFormData);
          break;
        case "google":
          console.log("GOOGLE AUTH HAS NOT BEEN SET UP.")
          break;
        default:
          return new Error("NO AUTHDATA FOUND!");

        break;
      }

    }


  }

})
