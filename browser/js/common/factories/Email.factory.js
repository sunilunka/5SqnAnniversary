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
      if(status === 200){
        return status;
      }
    })
    .catch(function(err){
      return err;
    })
  }

  EmailFactory.sendEventPaymentReceivedEmail = function(userData, eventData){
    var dataToSend = {
      user: userData,
      evt: eventData
    }

    return $http.post(DatabaseFactory.generateApiRoute('emails/event-payment-success'), dataToSend)
    .then(function(status){
      if(status === 200){
        return status;
      }
    })
    .catch(function(err){
      return err;
    })
  }


  return EmailFactory;

})
