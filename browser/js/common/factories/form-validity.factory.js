app.factory("FormValidityFactory", function(){

  var FormValidityFactory = {};

  /* Method to check passwords match on registration. Returns Boolean */
  FormValidityFactory.checkPasswordsMatch = (pwFieldOne, pwFieldTwo, pwOne, pwTwo) => {
    if(pwOne === pwTwo) return true;
    return false;
  }

  FormValidityFactory.formCheck = () => {

  }


  return FormValidityFactory;

})
