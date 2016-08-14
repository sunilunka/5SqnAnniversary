app.factory("EmailFactory", function(DatabaseFactory, $http){

  var EmailFactory = {};

  EmailFactory.sendNewRegisterNotification = function(userIdent){
    $http.post(DatabaseFactory.generateApiRoute('emails/register-success'), {
      userId: userIdent
    })
    .then(function(status){
      return status;
    })
    .catch(function(err){
      console.log("Email was not sent");
      return err;
    })
  }


  return EmailFactory;

})
