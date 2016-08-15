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
  },

  EmailFactory.sendGroupEmail = function(emailData){
    return $http.post(DatabaseFactory.generateApiRoute('emails/group'), emailData)
    .then(function(status){
      if((status === 200) || (status === 201)){
        return;
      }
    })
    .catch(function(err){
      return err;
    })
  }


  return EmailFactory;

})
