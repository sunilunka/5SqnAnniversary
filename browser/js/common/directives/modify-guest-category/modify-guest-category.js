app.directive("modifyGuestCategory", function(GuestCategoryFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/modify-guest-category/modify-guest-category.html",
    scope: {
      cat: "="
    },
    link: function(scope, element, attrs){

      scope.modifiableCatObj = {};

      angular.copy(scope.cat, scope.modifiableCatObj)

      scope.updateCatName = () => {
        GuestCategoryFactory.updateGuestCategory(scope.cat.$id, scope.modifiableCatObj.$value)
        .then(function(data){
          /* No data is returned from Firebase update. */
          console.log("UPDATED: ", scope.cat.$value);
        })
      }
    }
  }
})
