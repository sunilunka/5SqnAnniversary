app.directive("modifyGuestCategory", function(GuestCategoryFactory){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/modify-guest-category/modify-guest-category.html",
    scope: {
      cat: "="
    },
    link: function(scope, element, attrs){

      scope.isEditing = false;

      scope.toggleEdit = () => {
        console.log("ELEMENT SIBLINGS: ", element.find("input"))
        scope.isEditing = !scope.isEditing;
      }

      scope.updateCatName = () => {
        GuestCategoryFactory.updateGuestCategory(scope.cat.$id, scope.cat.$value);
      }
    }
  }
})
