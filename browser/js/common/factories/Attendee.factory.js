app.factory("AttendeeFactory", function($firebaseArray, $firebaseObject, UserAuthFactory, DatabaseFactory, RegisterFactory, SessionService, EventFactory, EventGuestFactory, AttendeeEventFactory, GuestCategoryFactory, SiteAuthFactory, GuestOriginFactory, PlatformsFactory){
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
    let userId = (currentUser.id || currentUser.uid || currentUser.$id);
    if(currentUser){
      console.log("CURRENT USER: ", SessionService.user);
      var userRef = DatabaseFactory.dbConnection("attendees/" + userId);
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
    let userId = (user.$id || user.uid || user.id);
    if(user.events.hasOwnProperty(evtId)){
      let userEventsRef = attendeesRef.child(userId).child("events");
      /* Need to get count of all current attendee guests + attendee themselves to event. That way, on removal, the correct number of persons are deducted from the event guest count. */
      return AttendeeEventFactory.getAttendeeGuestCount(evtId, userId)
       .then(function(count){
         /* Get count of current guests */
        return firebase.Promise.all([
          userEventsRef.update({ [evtId]: null }),
          EventFactory.removeAttendeeFromEvent(evtId, user, count), EventGuestFactory.removeAttendeeFromEventList(evtId, user),
          PlatformsFactory.removeFromEventTally(user.platforms, evtId)
        ])
      })
    }
  }

  AttendeeFactory.addEventToAttendee = (evtId, user) => {
    let userId = (user.$id || user.uid || user.id);
    return firebase.Promise.all([
      attendeesRef.child(userId).child("events").update({
        [evtId]: "No guests"
      }),
      EventFactory.addAttendeeToEvent(evtId, user),
      EventGuestFactory.addAttendeeToEventList(evtId, user),
      PlatformsFactory.addToEventTally(user.platforms, evtId)
    ])

  },

  AttendeeFactory.removeUser = function(userData){
    console.log("User data: ", userData);
    let userToRemove = userData;
    let platformsIdArray = Object.keys(userToRemove.platforms);
    /* If the user is not subscribed to any events, then add the events key to the userToRemove object to allow platforms to execute. */
    if(!userToRemove.hasOwnProperty("events")){
      userToRemove.events = {};
    }

    let userEvents = Object.keys(userToRemove.events);

    /* Remove user from category, no iteration so already in array to resolve. Remove user from platforms already occupies array, as it's methods already iterate over required keys. */
    let resolveToRemove = [
      GuestCategoryFactory.addOrRemoveGuestToCategory("remove", userToRemove.association, userToRemove.$id),
      PlatformsFactory.removeAttendeeFromPlatforms(platformsIdArray, userToRemove.events, userToRemove.$id),
      attendeesRef.update({ [userData.$id]: null })
  ];

    /* Remove guest from origin store */
    if(userToRemove.hasOwnProperty("overseas") && userToRemove["overseas"]){
      resolveToRemove.push(GuestOriginFactory.removeGuestFromOriginStore(userToRemove.$id))
    }

    /* If user has key "events", then for each event, execute removal from event and eventGuests (list) */
    if(userToRemove.hasOwnProperty("events")){
      if(userEvents.length > 0){
        for(var evt in userToRemove.events){
          resolveToRemove.push(AttendeeFactory.removeEventFromAttendee(evt, userToRemove));
        }
      }
    }

    return firebase.Promise.all(resolveToRemove);

  }

  AttendeeFactory.setOnline = (userId) => {
    return attendeesRef.child(userId).child("online").transaction(function(currentVal){
      return true;
    })
  }

  AttendeeFactory.setOffline = (userId) => {
    return attendeesRef.child(userId).child("online").transaction(function(currentVal){
      return false;
    });
  },

  AttendeeFactory.getAllStandard = () => {

  }

  return AttendeeFactory;

})
