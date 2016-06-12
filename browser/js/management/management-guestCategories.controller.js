app.controller("GuestCategoryCtrl", function($scope, GuestCategoryFactory, allCategories, PlatformsFactory, allPlatforms){

  $scope.guestCategories =  allCategories;

  $scope.allPlatforms = allPlatforms;


  $scope.addNewCategory = () => {
    console.log("CATEGORY TO SAVE: ", $scope.guestCategoryName)
    return GuestCategoryFactory.addGuestCategory($scope.guestCategoryName)
    .then(function(ref){
      $scope.guestCategoryName = null;
      console.log("CATEGORY ADDED!");
    })
    .catch(function(error){
      console.log("ERROR OCCURED: ", error);
    })
  }

  $scope.addNewPlatform = () => {
    console.log("ADDING PLATFORM: ", $scope.platformLabel)
    return PlatformsFactory.addPlatform($scope.platformLabel)
    .then(function(ref){
      $scope.platformLabel = null;
      console.log("PLATFORM WITH REF " + ref + "ADDED")
    })
    .catch(function(error){
      console.error("SORRY ERROR OCCURED: ", error);
    })
  }

})
