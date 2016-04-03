app.factory("AnnouncementsFactory", function($firebaseArray, DatabaseFactory){
  var announcementsRef = DatabaseFactory.dbConnection("announcements");
  var announcementList = $firebaseArray(announcementsRef);
  return {
    addNewAnnouncement: (formData) => {
      return announcementList.$add(formData)
      .then(function(data){
        console.log("NEW ANNOUNCEMENT ADDED: ", data)
        return data;
      })
    },

    removeAnnouncement: (announcementId) => {
      return announcementList.$remove(announcementId)
      .then(function(ref){
        console.log("ANNOUNCEMENT REMOVED!")
        return ref;
      })
    },

    getAnnouncement: (announcementId) => {
      return announcementList.$loaded()
      .then(function(data){
        console.log("RECORDED DATA: ", data)
        return data.$getRecord(announcementId);
      });
    },

    saveAnnouncement: (announcementData) => {
      return announcementList.$save(announcementData.$id)
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
