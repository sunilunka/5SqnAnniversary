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
      return response.data;
    },

    generateApiRoute: (route) => {
      if(route){
        return "https://stark-island-46136.herokuapp.com/api/" + route;
      } else {
        return "https://stark-island-46136.herokuapp.com/api/"
      }
    }
  }
})
