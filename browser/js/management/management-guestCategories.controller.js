app.controller("GuestCategoryCtrl", function($scope, allCategories){

  $scope.guestCategories =  allCategories;

  $scope.addNewCategory = () => {
    console.log("CATEGORY TO SAVE: ", $scope.guestCategoryName)
    return GuestCategoryFactory.addGuestCategory($scope.guestCategoryName)
    .then(function(ref){
      console.log("CATEGORY ADDED!");
    })
    .catch(function(err){
      console.log("ERROR OCCURED: ", err);
    })
  }

})
