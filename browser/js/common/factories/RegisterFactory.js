app.factory("RegisterFactory", function($firebaseArray, $firebaseObject, UserAuthFactory){
  var parseFbData = (data) => {
    var dataPath = data.facebook.cachedUserProfile;
    return {
      uid: data.uid,
      firstName: dataPath.first_name,
      lastName: dataPath.last_name,
      fbprofile: dataPath.link
    }
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
    registerNewUser: (method, authData) => {
      console.log("METHOD: ", method);
      console.log("DATA: ", authData);
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
            data.firstName = authData.firstName;
            data.lastName = authData.lastName;
            data.email = authData.email;
            return parseEmailData(data);
          })
        break;
        case "facebook":
          return UserAuthFactory.loginWithExternalProvider(method)
            .then(function(data){
              return parseFbData(data);
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
