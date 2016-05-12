app.directive("modifyGuestCategory", function(GuestCategoryFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/modify-guest-category/modify-guest-category.html",
    scope: {
      cat: "="
    },
    link: function(scope, element, attrs){

      scope.isEditing = false;

      scope.modifiableCatObj = {};

      angular.copy(scope.cat, scope.modifiableCatObj)

      scope.toggleEdit = () => {
        scope.isEditing = !scope.isEditing;
        if(!scope.isEditing){
          /* If user cancels editing, revert object to original. */
          console.log("ORIGINAL: ", scope.cat)
          angular.copy(scope.cat, scope.modifiableCatObj)
        }
      }

      scope.updateCatName = () => {
        GuestCategoryFactory.updateGuestCategory(scope.cat.$id, scope.modifiableCatObj.$value)
        .then(function(data){
          /* No data is returned from Firebase update. */
          console.log("UPDATED: ", scope.cat.$value);
          scope.isEditing = false;
        })
      }
    }
  }
})
