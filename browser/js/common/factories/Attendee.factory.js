app.factory('AttendeeFactory', function($firebaseArray, $firebaseObject, UserAuthFactory, DatabaseFactory, RegisterFactory, AuthService){
  var attendeesRef = DatabaseFactory.dbConnection('attendees');
  var attendeeObject = $firebaseObject(attendeesRef);
  return {
    /* Create a new user and log them in.
      => registerMethod takes a string denoting the register method.
      => newAttendeeData takes an object containing user data including password and email when registering with email.
    */
    createOneAndLogin: function(registerMethod, newAttendeeData){
      /* Need to instantiate a new $firebase array that is synchronised to the backend firebase application. Do not use the this.getAll, as the promise waits for resolution and then is further resolved in state, causing issues. $loaded only loads data on initial invocation and does not provide firebaseArray methods */
      // var attendeeList = $firebaseArray(attendeesRef);
      // attendeeList.$add(newAttendeeData)
      // .then(function(data){
      //   console.log("RETURNED: ", data)
      //   return data;
      // })
      // .catch(function(error){
      //   return error;
      // })

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
      console.log("CURRENT USER: ", currentUser)
      if(currentUser){
        var userRef = DatabaseFactory.dbConnection('attendees/' + currentUser.uid);
        var userObj = $firebaseObject(userRef);
        return userObj.$loaded()
        .then(function(ref){
          console.log("CURRENT USER OBJECT: ", userObj)
          return userObj;
        })
      } else {
        return;
      }
    }
  }
})
