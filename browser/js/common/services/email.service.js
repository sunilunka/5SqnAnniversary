app.service("EmailService", function(){

  var self = this;

  this.selectedUsersList = [];

  this.getSelectedUsers = function(){
    return self.selectedUsersList;
  }

  this.addUserToList = function(user){
    self.selectedUsersList.push(user);
    return self.selectedUsersList;
  }

  this.removeUserFromList = function(user){
    _.remove(self.selectedUsersList, function(userObj){
      return userObj.uid === user.uid;
    })
  }

  this.resetEmailDistributionList = function(){
    angular.copy([], self.selectedUsersList);
  }

})
