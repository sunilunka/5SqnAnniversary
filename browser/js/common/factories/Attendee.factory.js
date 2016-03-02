app.factory('AttendeeFactory', function($firebaseArray, $firebaseObject, UserAuthFactory, DatabaseFactory, RegisterFactory, AuthService){
  var attendeesRef = DatabaseFactory.dbConnection('attendees');
  var attendeeObject = $firebaseObject(attendeesRef);
  return {
    /* Create a new user and log them in.
      => registerMethod takes a string denoting the register method.
      => newAttendeeData takes an object containing user data including password and email when registering with email.
    */
    createOneAndLogin: function(registerMethod, newAttendeeData){
      /* First register the new user (if it does not exist), then once a unique ID has been generated, create an 'attendee' record for the person. */
      console.log('NEW ATTENDEE DATA: ', newAttendeeData)
      return RegisterFactory.registerNewUser(registerMethod, newAttendeeData)
      .then(function(newUser){
        console.log('NEW USER CREATED: ', newUser);
        if(!newUser) return new Error("No user created!");
        let userId = newUser.uid;
        /* Remove uid key and value from object so that it is not stored. It is used as the overall object key in the attendees schema.  */
        delete newUser.uid;
        attendeeObject[userId] = newUser;
        return attendeeObject.$save()
        .then(function(ref){
          console.log('REF: ', ref);
          if(ref) return attendeeObject[userId];
        });
      })
      .catch(function(error){
        console.warn('ERROR OCCURED: ', error);
        return error;
      })
    },

    createReferredUser: (formData) => {
      return RegisterFactory.registerReferredUser(formData)
      .then(function(userDataToSave){
        let userId = userDataToSave.uid;
        /* Create user object locally in attendees tables */
        attendeeObject[userId] = userDataToSave;
        /* Remove the uid key, as this is the identifier key, but we need it for reference when logging the user in after successfully saving. */
        delete attendeeObject[userId].uid;
        return attendeeObject.$save()
        .then(function(ref){
          RegisterFactory.addUserToEvents(userDataToSave)
          .then(function(savedEvents){
            console.log("SAVED EVENTS: ", savedEvents);
            console.log("USER DATA TO RETURN: ", userDataToSave);
            return userDataToSave;
          })
        })
      })
      .catch(function(error){
        return error;
      })
    },

    getAll: function(){
      return $firebaseArray(attendeesRef)
      .$loaded()
      .then(function(initialData){
        return initialData;
      })
      .catch(function(error){
        console.log('SORRY AN ERROR OCCURED');
      })
    },

    loginAttendee: function(loginData){
      return UserAuthFactory.loginByEmail({
        password: loginData.password,
        email: loginData.email
      })
    },

    getOne: function(){
      /* User the SessionService.getCurrentUser to get information*/
      var currentUser = AuthService.getCurrentUser();
      console.log("CURRENT USER: ", currentUser);
      if(currentUser){
        var userRef = DatabaseFactory.dbConnection('attendees/' + currentUser.uid);
        var userObj = $firebaseObject(userRef);
        return userObj.$loaded()
        .then(function(data){
          console.log("CURRENT USER OBJECT: ", data)
          return data;
        })
      } else {
        return;
      }
    }
  }
})
