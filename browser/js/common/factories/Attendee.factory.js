app.factory('AttendeeFactory', function($http, $firebaseArray, $firebaseObject, $firebaseAuth){
  var appRef = new Firebase('https://5sqnrnzaf.firebaseio.com/');
  var authRef = $firebaseAuth(appRef);
  var attendeesRef = new Firebase('https://5sqnrnzaf.firebaseio.com/attendees');
  var attendeeList = $firebaseArray(attendeesRef);
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
      authRef.$createUser({
        password: newAttendeeData.password,
        email: newAttendeeData.email
      })
      .then(function(newUser){
        console.log("NEW USER CREATED: ", newUser);
        return newUser;
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
    }
  }
})
