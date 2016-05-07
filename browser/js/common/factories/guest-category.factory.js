app.factory("GuestCategoryFactory", function(DatabaseFactory){
  var currentSqnRef = DatabaseFactory.dbConnection("current");
  var airforceRef = DatabaseFactory.dbConnection("airforce");
  var formerRef = DatabaseFactory.dbConnection("retired");
  var vipContractorRef = DatabaseFactory.dbConnection("vip-contractor");

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
    }
  }
})
