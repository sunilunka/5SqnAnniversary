app.directive("scrollBottom", function($timeout){
  return {
    restrict: "A",
    link: function(scope, element, attrs){
      let pastHeight = element[0].scrollHeight;

      setInterval(function(){
        let currentHeight = element[0].scrollHeight;
        if(currentHeight > pastHeight){
          element[0].scrollTop = currentHeight;
          pastHeight = currentHeight;
        }
      }, 200)

    }
  }
})
