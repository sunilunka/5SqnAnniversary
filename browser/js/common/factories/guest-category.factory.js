app.factory("GuestCategoryFactory", function(DatabaseFactory){
  var currentSqnRef = DatabaseFactory.dbConnection("current");
  var airforceRef = DatabaseFactory.dbConnection("airforce");
  var formerRef = DatabaseFactory.dbConnection("former");
  var vipContractorRef = DatabaseFactory.dbConnection("vip-contractor");

  return {
    addOrRemoveGuestToCategory: (option, category, guestIdent) => {
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
