/* Factory that returns the most commonly used functions for interacting with the Firebase database. */
app.factory('DatabaseFactory', function($firebaseAuth){
  var fireInstance = firebase.database().ref();
  return {
    dbConnection: (routing) => {
      if(routing){
        return firebase.database().ref(routing)
      } else {
        return fireInstance;
      }
    },

    authConnection: () => {
      return $firebaseAuth();
    },

    parseHTTPRequest: (response) => {
      console.log("RESPONSE DATA: ", response.data);
      return response.data;
    },

    generateApiRoute: (route) => {
      if(route){
        return "http://127.0.0.1:3000/api/" + route;
      } else {
        return "http://127.0.0.1:3000/api/"
      }
    }
  }
})
