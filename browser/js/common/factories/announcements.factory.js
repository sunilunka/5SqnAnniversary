app.factory("AnnouncementsFactory", function($firebaseArray, DatabaseFactory, $rootScope, NotificationService){
  var announcementsRef = DatabaseFactory.dbConnection("announcements");
  var announcementList = $firebaseArray(announcementsRef);
  return {
    addNewAnnouncement: (formData) => {
      formData.date = firebase.database.ServerValue.TIMESTAMP;
      return announcementList.$add(formData)
      .then(function(ref){
        NotificationService.notify("success", "New accouncement added");
        return ref;
      })
      .catch(function(error){
        NotificationService.notify("error", "Sorry we couldn't create the announcement at this time due to a problem. Try again later.")
        return error;
      })
    },

    removeAnnouncement: (announcement) => {
      return announcementList.$remove(announcement)
      .then(function(ref){
        console.log("ANNOUNCEMENT REMOVED: ", ref)
        return ref;
      })
    },

    getAnnouncement: (announcement) => {
      return announcementList.$loaded()
      .then(function(data){
        console.log("RECORDED DATA: ", data)
        return data.$getRecord(announcement);
      });
    },

    saveAnnouncement: (announcementData) => {
      console.log("ANNOUNCEMENT UPDATED DATA: ", announcementData)
      return announcementList.$save(announcementData)
      .then(function(ref){
        console.log("ANNOUNCEMENT MODIFIED: ", ref);
        return ref;
      })
    },

    getAllAnnouncements: () => {
      return announcementList.$loaded()
    }
  }

})
