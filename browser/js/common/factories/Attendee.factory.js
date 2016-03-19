app.factory('AttendeeFactory', function($firebaseArray, $firebaseObject, UserAuthFactory, DatabaseFactory, RegisterFactory, SessionService, EventFactory){
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
        return RegisterFactory.addUserToEvents(newUser)
        .then(function(savedEvents){
          return newUser;
        })
      })
      .catch(function(error){
        console.warn('ERROR OCCURED: ', error);
        return error;
      })
    },

    createNewUserFromExternalProvider: (authData, formData) => {
      let userData = RegisterFactory.newUserRegisterFromExternalProvider(authData, formData)
      if(!userData) return new Error("No user created!");
      let userId = userData.uid;
      /* Remove uid key and value from object so that it is not stored. It is used as the overall object key in the attendees schema.  */
      delete userData.uid;
      /* On Auth will trigger on referral back to 5sqnrnzaf domain. AttendeeObject will not repopulate from server as fast as code execution happens (asynchronous), so ensure attendee Object is loaded prior to performing operations on the db object */
      return attendeeObject.$loaded()
      .then(function(serverData){
        attendeeObject[userId] = userData;
        return attendeeObject.$save()
      })
      .then(function(ref){
        console.log("OBJECT SAVED");
        /* If window.sessionStorage is still populated, remove it, as it is no longer needed. */
        if(window.sessionStorage["registerData"]){
          window.sessionStorage.removeItem("registerData");
        }
        /* return newUser object, with uid field as it is used for registering events */
        userData.uid = userId;
        if(window.sessionStorage.hasOwnProperty("registerData")) window.sessionStorage.removeItem("registerData");
        if(ref) return userData;
      })
    },
    /* If a user tries to login and has no matching attendee key, redirect to register referred user state. */
    createReferredUser: (formData) => {
      return RegisterFactory.registerReferredUser(formData)
      .then(function(userDataToSave){
        if(!userDataToSave.events) userDataToSave.events = false;
        let userId = userDataToSave.uid;
        /* Remove the uid key, as this is the identifier key and there is no need to double up data */
        delete userDataToSave.uid;
        /* Create user object locally in attendees tables */
        attendeeObject[userId] = userDataToSave;
        return attendeeObject.$save()
        .then(function(ref){
          /* Add user to events uses uid key to allocate user to event */
          userDataToSave.uid = userId;
          return RegisterFactory.addUserToEvents(userDataToSave)
          .then(function(savedEvents){
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
      var currentUser = SessionService.user;
      console.log("CURRENT USER: ", currentUser);
      if(currentUser){
        var userRef = DatabaseFactory.dbConnection('attendees/' + (currentUser.id || currentUser.uid));
        var userObj = $firebaseObject(userRef);
        return userObj.$loaded()
        .then(function(data){
          return data;
        })
      } else {
        return;
      }
    },

    removeEventFromAttendee: (evtId, user) => {
      console.log("REMOVING FROM USER: ", user);
      if(user.events[evtId]){
        delete user.events[evtId];
        user.$save()
        .then(function(ref){
          return EventFactory.removeAttendeeFromEvent(evtId, user.$id);
        })

      }
    },

    addEventToAttendee: (evtId, user) => {
      if(user.hasOwnProperty("events")){
        user.events[evtId] = true;
      } else {
        user["events"] = {};
        user.events[evtId] = true;
      }
      return user.$save()
      .then(function(ref){
        console.log("USER OBJECT: ", user)
        return EventFactory.addAttendeeToEvent(evtId, user.$id)
        .then(function(ref){
          return ref;
        })
      })
    }

  }
})
