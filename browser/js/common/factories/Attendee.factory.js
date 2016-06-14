app.factory("AttendeeFactory", function($firebaseArray, $firebaseObject, UserAuthFactory, DatabaseFactory, RegisterFactory, SessionService, EventFactory, EventGuestFactory, AttendeeEventFactory, GuestCategoryFactory, SiteAuthFactory){
  var attendeesRef = DatabaseFactory.dbConnection("attendees");
  var attendeeObject = $firebaseObject(attendeesRef);

  var AttendeeFactory = {};

  /* Create a new user and log them in.
    => registerMethod takes a string denoting the register method.
    => newAttendeeData takes an object containing user data including password and email when registering with email.
  */
  AttendeeFactory.createOneAndLogin = function(registerMethod, newAttendeeData){
    /* First register the new user (if it does not exist), then once a unique ID has been generated, create an "attendee" record for the person. */
    return RegisterFactory.registerNewUser(registerMethod, newAttendeeData)
  }

  AttendeeFactory.createNewUserFromExternalProvider = (authData, formData) => {
    return RegisterFactory.newUserRegisterFromExternalProvider(authData, formData)
    .then(function(data){
      /* If window.sessionStorage is still populated, remove it, as it is no longer needed. */
      if(window.sessionStorage.hasOwnProperty("registerData")) window.sessionStorage.removeItem("registerData");
      return authData;
    })
    .catch(function(error){
      console.error("SORRY AN ERROR OCCURED: ", error);
      return error;
    })
  }

  /* If a user tries to login and has no matching attendee key, execute the following function to register from the new-attendee-external form on the referredNewAttendee state. */
  AttendeeFactory.createReferredUser = (referredProvider, referredUid, formData) => {
    return RegisterFactory.registerReferredUser(referredProvider, referredUid, formData)
    .then(function(savedData){
      console.log("SAVED DATA: ", savedData)
    })
    .catch(function(error){
      return error;
    })
  }

  AttendeeFactory.getAll = function(){
    return $firebaseArray(attendeesRef)
    .$loaded()
    .then(function(initialData){
      return initialData;
    })
    .catch(function(error){
      console.log("SORRY AN ERROR OCCURED");
    })
  }

  AttendeeFactory.loginAttendee = function(email, password){
    return UserAuthFactory.loginByEmail(email, password);
  }

  /* id is optional, used if no user is logged in (so no active session). */
  AttendeeFactory.getOne = function(id){
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
    } else if(id){
      var userToGetRef = DatabaseFactory.dbConnection("attendees/" + id);
      return $firebaseObject(userToGetRef).$loaded();
    } else {
      return;
    }
  }

  AttendeeFactory.removeEventFromAttendee = (evtId, user) => {
    console.log("REMOVING FROM USER: ", user);
    if(user.events.hasOwnProperty(evtId)){
      /* Need to get count of all current attendee guests + attendee themselves to event. That way, on removal, the correct number of persons are deducted from the event guest count. */
      return AttendeeEventFactory.getAttendeeGuestCount(evtId, user.$id)
       .then(function(count){
         /* Get count of current guests */
        delete user.events[evtId];
        return firebase.Promise.all([ user.$save(), EventFactory.removeAttendeeFromEvent(evtId, user, count), EventGuestFactory.removeAttendeeFromEventList(evtId, user)])
      })
      .then(function(data){
        return data;
      })
      .catch(function(error){
        console.log("SORRY AN ERROR OCCURED");
        return error;
      })
    }
  }

  AttendeeFactory.addEventToAttendee = (evtId, user) => {
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

  return AttendeeFactory;

})
