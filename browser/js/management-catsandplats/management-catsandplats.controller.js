app.controller("CatsAndPlatsCtrl", function($scope, GuestCategoryFactory, allCategories, PlatformsFactory, allPlatforms){

  $scope.guestCategories =  allCategories;

  $scope.allPlatforms = allPlatforms;


  $scope.addNewCategory = () => {
    return GuestCategoryFactory.addGuestCategory($scope.guestCategoryName)
    .then(function(ref){
      $scope.guestCategoryName = null;
    })
    .catch(function(error){
      console.log("ERROR OCCURED: ", error);
    })
  }

  $scope.addNewPlatform = () => {
    return PlatformsFactory.addPlatform($scope.platformLabel)
    .then(function(ref){
      $scope.platformLabel = null;
    })
    .catch(function(error){
      console.error("SORRY ERROR OCCURED: ", error);
    })
  }

})
