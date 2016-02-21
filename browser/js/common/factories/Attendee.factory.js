app.factory('AttendeeFactory', function($firebaseArray, $firebaseObject, UserAuthFactory, DatabaseFactory){
  var attendeesRef = DatabaseFactory.dbConnection('attendees');
  var attendeeObject = $firebaseObject(attendeesRef);
  return {
    createOneAndLogin: function(newAttendeeData){
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
      console.log("NEW ATTENDEE DATA: ", newAttendeeData)
      return UserAuthFactory.createNew({
        password: newAttendeeData.password,
        email: newAttendeeData.email
      })
      .then(function(newUser){
        console.log("NEW USER CREATED: ", newUser);
          let userId = newUser.uid;
          console.log("UID: ", userId)
          attendeeObject[userId] = {
            firstName: newAttendeeData.firstName,
            lastName: newAttendeeData.lastName,
            email: newAttendeeData.email

          }


        return attendeeObject.$save()
        .then(function(ref){
          if(ref) return attendeeObject[userId];
          return false;
        });
      })
      .catch(function(error){
        console.warn("ERROR OCCURED: ", error);
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

    loginAttendee: function(loginData){
      return UserAuthFactory.loginByEmail({
        password: loginData.password,
        email: loginData.email
      })
    },

    getOne: function(id){
      return attendeeObject[id];
    }
  }
})
