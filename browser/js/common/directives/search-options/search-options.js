app.directive("searchOptions", function(ManagementFactory, GuestOriginFactory, GuestCategoryFactory, QueryFactory, $timeout){
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

      scope.showEvents = false;

      scope.showPlatforms = false;

      scope.showCategories = false;

      var resetSubMenus = function(){
        scope.ShowEvent = false;
        scope.showPlatforms = false;
        scope.showCategories = false;
        return;
      }

      var setClassConfig = function(searchView){
         return "{'sqn-btn-disabled': loadingData || searchView ==='" + searchView + "'}";
      }

      var setDisabledConfig = function(searchView){
        return "loadingData || searchView ==='" + searchView + "'";
      }

      var executeSearch = function(searchFn, callback, id){
        scope.loadingData = true;
        searchFn(callback, id)
      }

      var sendResultsToParentScope = function(payload){
        return scope.$emit("resultsReceived", payload);
      }

      var searchComplete = function(){
        scope.loadingData = false;
        /* For some reason, $apply needs to be run when getting overseas users, I don't know why, however, this resolves any errors. Will look into it later. */
        $timeout(function(){
          scope.$apply();
        }, 1);
        return;
      }

      scope.executeCategoryQuery = function(catId){
        executeSearch(QueryFactory.getCategoryUsers, function(catUsers){
          sendResultsToParentScope(catUsers);
          scope.searchView = catId;
          return searchComplete();
        }, catId)
      }


      scope.userOptions = [
        {
          label: "View Overseas Users",
          classCriteria: setClassConfig("overseas"),
          disabledCriteria: setDisabledConfig("overseas"),
          clickAction: () => {
            executeSearch(GuestOriginFactory.getOverseasData, function(users){
              sendResultsToParentScope(users);
              scope.searchView = "overseas";
              resetSubMenus();
              return searchComplete();
            })
          }

        },
        {
          label: "View Managers",
          classCriteria: setClassConfig("managers"),
          disabledCriteria: setDisabledConfig("managers"),
          clickAction: () => {
            executeSearch(ManagementFactory.getManagers, function(managers){
              sendResultsToParentScope(managers);
              scope.searchView = "managers";
              resetSubMenus();
              return searchComplete();
            })
          }
        },
        {
          label: "View By Events",
          classCriteria: setClassConfig("events"),
          disabledCriteria: setDisabledConfig("events"),
          clickAction: () => {
            scope.showCategories = false;
            scope.showPlatforms = false;
            scope.showEvents = true;
          }
        },
        {
          label: "View By Category",
          classCriteria: setClassConfig("categories"),
          disabledCriteria: setDisabledConfig("categories"),
          clickAction: () => {
            scope.showEvents = false;
            scope.showPlatforms = false;
            scope.showCategories = true;
          }
        },
        {
          label: "View By Platform",
          classCriteria: setClassConfig("platforms"),
          disabledCriteria: setDisabledConfig("platforms"),
          clickAction: () => {
            scope.showEvents = false;
            scope.showCategories = false;
            scope.showPlatforms = true;
          }
        }

      ]

    }

  }

})
