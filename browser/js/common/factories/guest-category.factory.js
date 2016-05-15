app.factory("GuestCategoryFactory", function(DatabaseFactory, $firebaseArray){

  var guestCategoriesRef = DatabaseFactory.dbConnection("guestCategories");
  var guestCatArray = $firebaseArray(guestCategoriesRef);

  return {
    addOrRemoveGuestToCategory: (option, category, guestIdent) => {
      /* Create variable containing dbConnection to the category required */
      var dbCategoryRef = DatabaseFactory.dbConnection(category);
      if(option === "add"){
        console.log("ADDING NEW USER TO DB REF: ", guestIdent)
        return dbCategoryRef.update({
          [guestIdent]: true
        })
        .then(function(ref){
          console.log("DATABASE CATEGORY UPDATED: ", ref);
          return ref;
        })
      } else if (option === "remove") {
        return dbCategoryRef.update({
          /* Giving a Firebase key a value of null will initiate a removal from the Firebase key/value store */
          [guestIdent]: null
        })
        .then(function(ref){
            console.log("DATABASE ENTRY REMOVED: ", ref);
            return ref;
        })
      }
    },

    getGuestCategories: () => {
      return guestCatArray.$loaded()
      .then(function(arr){
        console.log("ARRAY FOUND AND POPULATED: ", arr)
        return arr;
      })
    },

    addGuestCategory: (guestCatName) => {
      return guestCatArray.$add(guestCatName)
      .then(function(ref){
        return ref;
      })
    },

    removeGuestCategory: () => {
      guestCategoryiesRef.$remove();
    },

    updateGuestCategory: (id, catName) => {
      var catUpdateObj = {};
      catUpdateObj[id] = catName
      return guestCategoriesRef.update(catUpdateObj);

    }
  }
})
