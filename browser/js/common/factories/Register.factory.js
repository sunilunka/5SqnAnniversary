app.factory("RegisterFactory", function(UserAuthFactory, EventFactory){

  /* Object to save user to events object */
  var addUserToEvents = (eventObj, guestId, callback) => {
    /* For each object key, check it exists, if so, add to selected event*/
    if(Object.keys(eventObj).length === 0) return callback();
    for(var event in eventObj){
      if(eventObj[event]){
        return EventFactory.addAttendeeToEvent(event.toString(), guestId)
        .then(function(ref){
          return callback();
        })
      }
    }
  }

  var parseFbData = (authData, formData) => {
    var dataPath = authData.facebook.cachedUserProfile;
    if(!formData.events) formData.events = {};
    return addUserToEvents(formData.events, authData.uid, function(){
      return {
        uid: authData.uid,
        firstName: dataPath.first_name,
        lastName: dataPath.last_name,
        fbprofile: dataPath.link,
        association: formData.association,
        events: formData.events || null
      }
    })
  }

  var parseEmailData = (data) => {
    return {
      uid: data.uid,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email
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
           email: authData.email,
           password: authData.password
         })
          .then(function(data){
            /* Once user id has been created and returned from firebase instance for email/password combination, then return uid and append all relevant data passed in with authData.
            */
            data.firstName = userData .firstName;
            data.lastName = userData.lastName;
            data.email = userData.email;
            data.association =  userData.association;
            data.events = userData.events;
            return parseEmailData(data);
          })
        break;
        case "facebook":
          /* If the user has already logged in, but has been referred due to not having registered, this will still take place. */
          return UserAuthFactory.loginWithExternalProvider(method)
            .then(function(data){
              console.log("REGISTER FACTORY FB AUTH DATA:", data);
              return parseFbData(data, userData);
            })
          break;
        case "google":
          return UserAuthFactory.loginWithExternalProvider(method);
          break;
        default:
          return new Error("Sorry, a server error has occured!");
          break;
      }
    }
  }

})
