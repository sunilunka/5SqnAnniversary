app.factory("FormValidityFactory", function(){

  var FormValidityFactory = {};

  FormValidityFactory.checkEvents = (evtObj) => {
    if(evtObj.hasOwnProperty("events")){
      let evts = evtObj["events"];
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

  return FormValidityFactory;

})
