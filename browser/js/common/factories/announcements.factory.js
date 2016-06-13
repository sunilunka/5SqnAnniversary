app.factory("AnnouncementsFactory", function($firebaseArray, DatabaseFactory){
  var announcementsRef = DatabaseFactory.dbConnection("announcements");
  var announcementList = $firebaseArray(announcementsRef);
  return {
    addNewAnnouncement: (formData) => {
      formData.date = firebase.database.ServerValue.TIMESTAMP;
      return announcementList.$add(formData)
      .then(function(ref){
        console.log("NEW ANNOUNCEMENT ADDED: ", ref)
        return ref;
      })
      .catch(function(error){
        console.log("SORRY AN ERROR OCCURED: ", error)
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
