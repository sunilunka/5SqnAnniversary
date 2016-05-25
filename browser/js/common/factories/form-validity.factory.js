app.factory("FormValidityFactory", function(){

  var FormValidityFactory = {};

  /* Method to check passwords match on registration. Returns Boolean */
  FormValidityFactory.checkPasswordsMatch = (pwOne, pwTwo) => {
    console.log("FORM VALIDITY: ", $scope.register);
    let pOne = $scope.passwordOne || false;
    let pTwo = $scope.newAttendeeData.password || false;
    console.log("P1: ", $scope.register.passwordOne.$dirty);
    console.log("P2: ", $scope.register.passwordTwo.$dirty);
    return pOne ? (pTwo ? (pOne === pTwo) : false) : false;
  }

  /* Dictates when to run a password check for both passwords*/
  FormValidityFactory.passwordFormCheck = () => {

  }

  /* Checks if check boxes and radio button fields have been employed. If not, form is not submitted. */
  FormValidityFactory.registrationFormCheck = () => {

  }


  return FormValidityFactory;

})
