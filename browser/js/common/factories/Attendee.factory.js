app.factory("AttendeeFactory", function($firebaseArray, $firebaseObject, UserAuthFactory, DatabaseFactory, RegisterFactory, SessionService, EventFactory, EventGuestFactory, AttendeeEventFactory, GuestCategoryFactory, SiteAuthFactory){
  var attendeesRef = DatabaseFactory.dbConnection("attendees");
  var attendeeObject = $firebaseObject(attendeesRef);


  return {
    /* Create a new user and log them in.
      => registerMethod takes a string denoting the register method.
      => newAttendeeData takes an object containing user data including password and email when registering with email.
    */
    createOneAndLogin: function(registerMethod, newAttendeeData){
      /* First register the new user (if it does not exist), then once a unique ID has been generated, create an "attendee" record for the person. */
      console.log("NEW ATTENDEE DATA: ", newAttendeeData)
      return RegisterFactory.registerNewUser(registerMethod, newAttendeeData)
      .then(function(newUser){
        /* This promise will only be called when registering with email. */
        console.log("NEW USER: ", newUser)
        return RegisterFactory.addUserToEvents(newUser)
        .then(function(savedEvents){
          return GuestCategoryFactory.addOrRemoveGuestToCategory("add", newUser.association, newUser.uid)
        })
      })
      .then(function(ref){
        /* Ref will be undefined, as nothing is returned from a standard Firebase JS API update method call. */
      })
      .then(function(ref){

        return UserAuthFactory.loginByEmail(newAttendeeData.email, newAttendeeData.password)
      })
      .then(function(authData){
        SiteAuthFactory.setSessionAndReRoute(authData, "attendee", { id: authData.uid });
        return authData;
      })
    },

    createNewUserFromExternalProvider: (authData, formData) => {
      let userData = RegisterFactory.newUserRegisterFromExternalProvider(authData, formData)
      if(!userData) return new Error("No user created!");
      let userId = userData.uid;
      /* Remove uid key and value from object so that it is not stored. It is used as the overall object key in the attendees schema.  */
      delete userData.uid;
      /* On Auth will trigger on referral back to 5sqnrnzaf domain. AttendeeObject will not repopulate from server as fast as code execution happens (asynchronous), so ensure attendee Object is loaded prior to performing operations on the db object */
      return attendeesRef.update({
        [userId]: userData
      })
      .then(function(ref){
        /* No data is returned from the resolved update promise when using native javascript API methods, ref will be undefined */
        userData.uid = userId; /* Add id key back to user object, as is required for further registery actions. */
        return RegisterFactory.addUserToEvents(userData)
        .then(function(savedEvents){
          return  GuestCategoryFactory.addOrRemoveGuestToCategory("add", userData.association, userId)

        })
        .then(function(ref){
        /* If window.sessionStorage is still populated, remove it, as it is no longer needed. */
          if(window.sessionStorage.hasOwnProperty("registerData")) window.sessionStorage.removeItem("registerData");
          /* return newUser object, with uid field as it is used for registering events */
          userData.uid = userId;

          return userData;
        })
      })
    },
    /* If a user tries to login and has no matching attendee key, execute the following function to register from the new-attendee-external form on the referredNewAttendee state. */
    createReferredUser: (referredProvider, referredUid, formData) => {
      return RegisterFactory.registerReferredUser(referredProvider, referredUid, formData)
      .then(function(userDataToSave){
        console.log("USERDATA TO SAVE: ", userDataToSave)
        if(!userDataToSave.events) userDataToSave.events = false;
        let userId = userDataToSave.uid;
        /* Remove the uid key, as this is the identifier key and there is no need to double up data */
        delete userDataToSave.uid;
        /* Create user object locally in attendees table locally and on server */
        return attendeesRef.update({
          [userId]: userDataToSave
        })
        .then(function(ref){
          /* Add user to events uses uid key to allocate user to event, by adding it as a key to the eventGuests -> [eventKey] store */
          userDataToSave.uid = userId;
          return RegisterFactory.addUserToEvents(userDataToSave)
          .then(function(savedEvents){
            /* Once promise is successfully resolved, add user to Guest Category. */
            return GuestCategoryFactory.addOrRemoveGuestToCategory("add", userDataToSave.association, userId)
            .then(function(ref){
              /* Return the userDataToSave as this is the data the will be used to create the first session on redirect. */
              return userDataToSave;
            })
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
        console.log("SORRY AN ERROR OCCURED");
      })
    },

    loginAttendee: function(email, password){
      return UserAuthFactory.loginByEmail(email, password);
    },

    getOne: function(){
      /* Look at session service user to get current user */
      var currentUser = SessionService.user;
      console.log("CURRENT USER: ", currentUser);
      if(currentUser){
        var userRef = DatabaseFactory.dbConnection("attendees/" + (currentUser.id || currentUser.uid));
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
      if(user.events.hasOwnProperty(evtId)){
        /* Need to get count of all current attendee guests + attendee themselves to event. That way, on removal, the correct number of persons are deducted from the event guest count. */
        return AttendeeEventFactory.getAttendeeGuestCount(evtId, user.$id)
         .then(function(count){
           /* Get count of current guests */
          delete user.events[evtId];
          return user.$save()
          .then(function(ref){
            return EventFactory.removeAttendeeFromEvent(evtId, user, count);
          })
          .then(function(ref){
            return EventGuestFactory.removeAttendeeFromEventList(evtId, user);
          })
        })
      }
    },

    addEventToAttendee: (evtId, user) => {
      if(user.hasOwnProperty("events")){
        user.events[evtId] = "No guests";
      } else {
        /* If events object in local db does not exist, create it */
        user["events"] = {};
        user.events[evtId] = "No guests";
      }
      return user.$save()
      .then(function(ref){
        return EventFactory.addAttendeeToEvent(evtId, user)
        .then(function(ref){
          return ref;
        })
      })
      .then(function(ref){
        return EventGuestFactory.addAttendeeToEventList(evtId, user);
      })
    }
  }
})
