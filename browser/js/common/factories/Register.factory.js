app.factory("RegisterFactory", function($firebaseObject, UserAuthFactory, EventFactory, DatabaseFactory, EventGuestFactory, GuestOriginFactory, GuestCategoryFactory, PlatformsFactory, $q){
  var attendeesRef = DatabaseFactory.dbConnection('attendees');
  var attendeeObject = $firebaseObject(attendeesRef);

  var RegisterFactory = {};

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

  /* Parse the new providerData array for authentication objects */

  var getProviderData = (authData) => {
    /* Returns first element in the providerData array which is an object providing the provider Identification tag. */
    return authData.providerData[0];

  }

  /* Change event data to what is required in the schema. Because a user cannot allocate guests until they have registered, the default value will always be 'no guests', a null value removes it from the database. */
  var modifyEventData = (userEventObj, firstName, lastName) => {
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

  /* Similar method to event one above, removing false values (this indicates user selected then deselected the checkbox)*/
  var modifyPlatformsData = function(userPlatformsObj){
    for(var platform in userPlatformsObj){
      if(!userPlatformsObj[platform]){
        delete userPlatformsObj[platform];
      }
    }
    return userPlatformsObj;
  }

  var storeRegisterDataForRedirect = (method, registerData) => {

    var toStore = {}
    /* Primary key for register data is provider name to allow parsing by correct method */
    toStore[method] = registerData;
    var storePrepped = JSON.stringify(toStore);
    if (window.sessionStorage){
      window.sessionStorage.setItem("registerData", storePrepped);
    }
  }

  /* newUser is the parsed data to be saved to the firebase backend */
  var saveUserDetailsToDb = (newUser) => {
    if(!newUser) return new Error("No user created!");

    var dataStorePromises = [];
    var dbAttendeeObject = {};

    angular.copy(newUser, dbAttendeeObject);
    /* Remove uid key and value from object so that it is not stored. It is used as the overall object key in the attendees schema.  */
    delete dbAttendeeObject.uid;

    /* Store data to attendee document object */
    dataStorePromises.push(attendeesRef.update({
      [newUser.uid]: dbAttendeeObject
    }));

    /* Add user Id in all for all other methods*/

    /* Store data to events and platforms objects*/
    dataStorePromises.push(RegisterFactory.addUserToEventsAndPlatforms(newUser));

    /* Store data to guest category objects */
    dataStorePromises.push(GuestCategoryFactory.addOrRemoveGuestToCategory("add", newUser.association, newUser.uid));

    /* Store data to guest origin database object document */

    dataStorePromises.push(GuestOriginFactory.addGuestToOriginStore(newUser));

    return firebase.Promise.all(dataStorePromises);

  }

  var splitName = function(nameString){
     var nameArray = nameString.split(" ");
     return {
       first_name: nameArray[0],
       last_name: nameArray[1]
     }
  }

  var parseFbData = (authData, formData) => {
    var nameObj = splitName(authData.displayName);

    return {
      uid: authData.uid,
      firstName: nameObj.first_name,
      lastName: nameObj.last_name,
      email: formData.email,
      association: formData.association,
      overseas: formData.overseas,
      events: modifyEventData(formData.events, nameObj.first_name, nameObj.last_name),
      platforms: modifyPlatformsData(formData.platforms),
      online: false
    }
  }

  /* Will be created once Firebase 3.x.x and AngularFire 2.x.x is released. */
  var parseGoogleData = (authData, formData) => {
    var nameObj = splitName(authData.displayName);

    return {
      uid: authData.uid,
      firstName: nameObj.first_name,
      lastName: nameObj.last_name,
      email: formData.email,
      association: formData.association,
      overseas: formData.overseas,
      events: modifyEventData(formData.events, nameObj.first_name, nameObj.last_name),
      platforms: modifyPlatformsData(formData.platforms),
      online: false
    }
  }

  var parseEmailData = (authData, formData) => {
    return {
      uid: authData.uid,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      association: formData.association,
      overseas: formData.overseas,
      events: modifyEventData(formData.events, formData.firstName, formData.lastName),
      platforms: modifyPlatformsData(formData.platforms),
      online: false
  }
}



    /* Function that takes a string describing a method as the first argument. the second argument is primarily for auth by email and password.
      => authData takes an object with the keys 'email' and 'password' and associated values.
      => AuthData also contains all other data the attendee has entered into the form and needs to be included for operations once a new user had successfully been created.
    */
    RegisterFactory.registerNewUser = (method, userData) => {
      switch(method){
        case "email":
         /* Create new user in database based on provided email and password */
         return UserAuthFactory.createNew(userData.email, userData.password)
        .then(function(data){
          /* Data returned from creating a new user with email and password => just uid */
          var userInfo = parseEmailData(data, userData);
          return saveUserDetailsToDb(userInfo);
        })
        .catch(function(error){
          throw new Error(error.message);
        })
        break;
         default:
          storeRegisterDataForRedirect(method, userData);
          return UserAuthFactory.loginWithExternalProvider(method)
            .then(function(){
              /* Nothing will occur here as Firebase OAuthRedirect promise is negated by the site redirect. This is instead captured when listening for the OAuth event once login is complete.*/
            })
            .catch(function(error){
              return error;
            })
          break;
      }
    },
    /* If a user has tried to login, but has not registered, get their auth data with promisifyAuthData method (as their login details are stored in the firebase auth store.) */
    RegisterFactory.registerReferredUser = (referredProvider, referredUid, formData) => {
      return promisifyAuthData()
      .then(function(authData){
        let providerInfo = getProviderData(authData);
        let providerIdent = providerInfo.providerId;

        if((authData.uid === referredUid) && (providerIdent === referredProvider)){

        /* Once firebase authentication has been returned, merge with formData for saving into firebase attendee store */
          if(providerIdent === "facebook.com"){
            return saveUserDetailsToDb(parseFbData(authData, formData));

          } else if(providerIdent === "google.com"){
              return saveUserDetailsToDb(parseGoogleData(authData, formData));

          } else if(providerIdent === "password"){
              /* To be completed, full function flow not complete, referred attendee state needs firstName and lastName fields for email */
            return saveUserDetailsToDb(parseEmailData(authData, formData));
          } else {
            throw new Error("No provider data found!");
          }
        } else {
          throw new Error("No matching authentication credentials found!");
        }
      })
    },

    /* Function to save user to events object. Key is user uid, value is true */
    RegisterFactory.addUserToEventsAndPlatforms = (userData) => {
      /* If no event has been selected (the fields have not been touched => 'pristine') then create a new empty object to continue. This is an isolated case, as there is validation on the form. */

      if(!userData.events) userData.events = {};
      let eventObj = userData.events;
      /* Like events (we shall see), the user platform object should all be valid, due to the modifyPlatformsData fn that takes place to parse the data. . */
      let platformKeys = Object.keys(userData.platforms);

      /* For each object key, check it exists, if so, add to selected event*/

      /* Populate array with platforms and guest origin promises */

      var recordsToSave = [PlatformsFactory.addAttendeeToPlatforms(platformKeys, eventObj, userData.uid)];

      for(var eventId in eventObj){
        /* Use the Event Factory to makes changes to local firebase instance for each key in the events object. If it is true, addAttendeeToEvent */
        if(eventObj.hasOwnProperty(eventId) && eventObj[eventId]){
          /* Push unresolved adding attendee to event promise to array*/
          recordsToSave.push(EventFactory.addAttendeeToEvent(eventId, userData));
          /* Push unresolved adding attendee name to event guest list to array */
          recordsToSave.push(EventGuestFactory.addAttendeeToEventList(eventId, userData))
        }
      }

      /* Return the result of all resolved promises in array saved event records on resolution or rejection. Using this method means if one promise fails, then all promises will be rejected.  */
      return firebase.Promise.all(recordsToSave)
      .then(function(data){
        return data;
      })
      .catch(function(error){
        return error;
      })

    }

    /* Function to save user data to window.SessionStorage on redirect, as the resolved promise does not return any data due to OAuth Redirect */

    RegisterFactory.newUserRegisterFromExternalProvider = (authData, registerFormData) => {

      switch(getProviderData(authData).providerId){
        case "facebook.com":
          return saveUserDetailsToDb(parseFbData(authData, registerFormData));
          break;

        case "google.com":
          return saveUserDetailsToDb(parseGoogleData(authData, registerFormData));
          break;
        default:
          throw new Error("NO AUTHDATA FOUND!");

        break;
      }

    }

    return RegisterFactory;

})
