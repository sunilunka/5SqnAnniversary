app.config(function($stateProvider){
  $stateProvider.state('anniversary', {
    url: '/anniversary',
    controller: 'AnniversaryCtrl',
    data: {
      authenticate: true
    },
    templateUrl: 'js/anniversary/anniversary.html'
  })
})
