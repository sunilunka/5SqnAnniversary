app.factory("AnnouncementsFactory", function($firebaseArray, DatabaseFactory){
  var announcementsRef = DatabaseFactory.dbConnection("announcements");
  var announcementList = $firebaseArray(announcementsRef);
  return {
    addNewAnnouncement: (formData) => {
      console.log("CAN WE PARSE FOR JSON TO PRESERVE TYPING: ", JSON.stringify(formData.content.replace(/\\/, "\\")));
      return announcementList.$add(formData)
      .then(function(ref){
        console.log("NEW ANNOUNCEMENT ADDED: ", ref)
        return ref;
      })
    },

    removeAnnouncement: (announcement) => {
      return announcementList.$remove(announcement)
      .then(function(ref){
        console.log("ANNOUNCEMENT REMOVED: ", ref)
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
