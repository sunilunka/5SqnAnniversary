app.config(function($stateProvider){
  $stateProvider.state("managementCatsAndPlats", {
      url: '/management/categories-and-platforms',
      controller: 'CatsAndPlatsCtrl',
      templateUrl: 'js/management-catsandplats/management-catsandplats.html',
      data: {
        authRequired: true,
        adminRequired: true
      },
      resolve: {
        allCategories: (GuestCategoryFactory) => {
          return GuestCategoryFactory.getGuestCategories();
        },
        allPlatforms: (PlatformsFactory) => {
          return PlatformsFactory.getPlatforms();
        }
      }

  })
})
