app.directive("searchOptions", function(ManagementFactory, GuestOriginFactory, GuestCategoryFactory, $timeout){
  return {
    restrict: "E",
    templateUrl: "js/common/directives/search-options/search-options.html",
    scope: {
      evts: "=",
      categories: "=",
      platforms: "="
    },
    link: function(scope, element, attrs){

      scope.loadingData = false;

      scope.searchView;

      var executeSearch = function(searchFn, callback){
        scope.loadingData = true;
        searchFn(callback)
      }

      var searchComplete = function(){
        scope.loadingData = false;
        /* For some reason, $apply needs to be run when getting overseas users, I don't know why, however, this resolves any errors. Will loo into it later. */
        $timeout(function(){
          scope.$apply();
        }, 1);
        return;
      }


      scope.userOptions = [
        {
          label: "View Overseas Users",
          classCriteria: "{'sqn-btn-disabled': loadingData || searchView === 'overseas'}",
          disabledCriteria: "loadingData || searchView === 'overseas'",
          clickAction: () => {
            executeSearch(GuestOriginFactory.getOverseasData, function(users){
              scope.$emit("resultsReceived", users);
              scope.searchView = "overseas";
              return searchComplete();
            })
          }

        },
        {
          label: "View Managers",
          classCriteria: "{'sqn-btn-disabled': loadingData || searchView === 'managers'}",
          disabledCriteria: "loadingData || searchView === 'managers'",
          clickAction: () => {
            executeSearch(ManagementFactory.getManagers, function(managers){
              scope.searchResults = managers;
              scope.searchView = "managers";
              return searchComplete();
            })
          }
        }

      ]

    }
  }

})
