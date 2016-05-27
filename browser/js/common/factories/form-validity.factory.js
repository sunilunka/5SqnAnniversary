app.factory("FormValidityFactory", function(){

  var FormValidityFactory = {};

  FormValidityFactory.checkEvents = (evtObj) => {
    if(!evtObj) return false;
    let evtKeys = Object.keys(evtObj);
    var attendingCount = 0;
    if(evtKeys.length > 0){
      for(var evt in evtObj){
        if(evtObj[evt]){
          attendingCount++;
        }
      }
    }
    /* If the attending count is greater than zero then return true, the user has selected an event. */
    if(attendingCount) return true;
    /* If array length is zero, or another fail condition is met, return false */
    return false;
  }

  /* Checks form for all data, and throws error if values are missing. Matches fields in the angular form validation object with those of the inputs.  */
  FormValidityFactory.submitFormCheck = (formData, formValid, exemptFields) => {
    console.log("FORM DATA OBJECT: ", formData);
    console.log("FORM VALIDITY DATA: ", formValid);
    if(formData.hasOwnProperty("events")){
      if(FormValidityFactory.checkEvents(formData.events)){

      }
    }
    return false;
  }

  /* Checks if check boxes and radio button fields have been employed. If not, form is not submitted. */


  return FormValidityFactory;

})
