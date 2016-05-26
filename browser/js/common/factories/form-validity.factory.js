app.factory("FormValidityFactory", function(){

  var FormValidityFactory = {};

  /* Method to check passwords match on registration. Returns Boolean */
  FormValidityFactory.checkPasswordsMatch = (pwOne, pwTwo) => {
    let pOne = pwOne|| false; // If no password given, return false.
    let pTwo = pwTwo || false;
    return pOne ? (pTwo ? (pOne === pTwo) : false) : false;
  }

  FormValidityFactory.checkEvents = () => {
    
  }

  /* Checks form for all data, and throws error if values are missing. */
  FormValidityFactory.submitFormCheck = (formData, formValid) => {
    console.log("FORM DATA OBJECT: ", formData);
    console.log("FORM VALIDITY DATA: ", formValid);

  }

  /* Checks if check boxes and radio button fields have been employed. If not, form is not submitted. */


  return FormValidityFactory;

})
