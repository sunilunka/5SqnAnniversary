app.factory("FormValidityFactory", function(){

  var FormValidityFactory = {};

  FormValidityFactory.checkEvents = (formData) => {
    if(formData.hasOwnProperty("events")){
      let evts = formData["events"];
      let evtKeys = Object.keys(evts);
      var attendingCount = 0;
      if(evtKeys.length > 0){
        for(var evt in evts){
          if(evts[evt]){
            attendingCount++;
          }
        }
      }
      /* If the attending count is greater than zero then return true, the user has selected an event. */
      if(attendingCount) return true;
    }
    /* If array length is zero, or another fail condition is met, return false */
    return false;
  }

  FormValidityFactory.checkPlatforms = function(formData){
    /* If platform object exists, then check if there at least one key is true. If not, then return false. */
    if(formData.hasOwnProperty("platforms")){
      let platformObj = formData.platforms;
      let count = 0;
      for(var platform in platformObj){
        if(platformObj[platform]){
          count++;
        }
      }
      /* If count of true values is greater than zero, return true */
      if(count) return true;
      return false; /* Return false if no true values are found. */
    }
    return false;

  }

  return FormValidityFactory;

})
